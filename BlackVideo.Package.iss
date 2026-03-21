; BlackVideo Installer for Windows
; Requires Inno Setup 6+

#define MyAppName "BlackVideo"
#define MyAppPublisher "BlackBlazent"
#define MyAppURL "https://github.com/your-repo/BlackVideo"
#define MyAppExeName "blackvideo.exe"                ; adjust if different
#define SourceDir "C:\Path\To\Your\BuiltApp"         ; your release folder
#define WebView2Bootstrapper "MicrosoftEdgeWebview2Setup.exe"

[Setup]
AppId={{A8B9F5E2-4C7D-4A8E-9F1C-3B6D0E5F7A8C}}   ; unique GUID – change if needed
AppName={#MyAppName}
AppVersion={#GetFileVersion(SourceDir + "\" + MyAppExeName)}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=LICENSE.txt                           ; optional – place in script folder
OutputDir=.\Installer
OutputBaseFilename=BlackVideo_Setup
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin                          ; needed to install WebView2

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "{cm:CreateQuickLaunchIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked; OnlyBelowVersion: 6.1

[Files]
; Main application files
Source: "{#SourceDir}\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#SourceDir}\*.dll"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

; WebView2 bootstrapper (included for convenience)
Source: "{#WebView2Bootstrapper}"; DestDir: "{tmp}"; Flags: deleteafterinstall

; Optional: include a license file
; Source: "LICENSE.txt"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: quicklaunchicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

; Check and install WebView2 if missing
[Code]
function IsWebView2Installed(): Boolean;
var
  Version: String;
begin
  Result := RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', Version) or
            RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}', 'pv', Version);
  if not Result then
    Result := RegQueryStringValue(HKLM, 'SOFTWARE\Microsoft\Edge\WebView2\Installed', 'Version', Version);
end;

procedure InstallWebView2();
var
  ResultCode: Integer;
  BootstrapperPath: String;
begin
  BootstrapperPath := ExpandConstant('{tmp}\MicrosoftEdgeWebview2Setup.exe');
  if FileExists(BootstrapperPath) then
  begin
    if Exec(BootstrapperPath, '/silent /install', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
      if ResultCode = 0 then
        Log('WebView2 installed successfully')
      else
        Log('WebView2 installation returned code: ' + IntToStr(ResultCode));
    end
    else
      MsgBox('Failed to launch WebView2 installer. Please install Microsoft Edge WebView2 manually from: ' +
             'https://go.microsoft.com/fwlink/p/?LinkId=2124703', mbError, MB_OK);
  end
  else
    MsgBox('WebView2 bootstrapper not found. Please install Microsoft Edge WebView2 manually.', mbError, MB_OK);
end;

function InitializeSetup(): Boolean;
begin
  if not IsWebView2Installed() then
  begin
    if MsgBox('BlackVideo requires Microsoft Edge WebView2 to run. Do you want to install it now?', mbConfirmation, MB_YESNO) = IDYES then
      InstallWebView2()
    else
    begin
      MsgBox('WebView2 is required. Installation will continue, but the application may not work correctly.', mbInformation, MB_OK);
    end;
  end;
  Result := True;
end;