// Add these commands to your Tauri backend (src-tauri/src/main.rs or commands.rs)

use std::process::Command;
use tauri::command;

#[command]
pub fn get_platform() -> String {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    format!("{}-{}", os, arch)
}

#[command]
pub fn get_ffmpeg_version(path: String) -> Result<String, String> {
    let output = Command::new(&path)
        .arg("-version")
        .output()
        .map_err(|e| format!("Failed to execute FFmpeg: {}", e))?;
    
    if !output.status.success() {
        return Err("FFmpeg execution failed".to_string());
    }
    
    let version_output = String::from_utf8_lossy(&output.stdout);
    
    // Extract version from output (first line typically contains version info)
    let version_line = version_output
        .lines()
        .next()
        .unwrap_or("Unknown version")
        .to_string();
    
    Ok(version_line)
}

#[command]
pub fn check_file_executable(path: String) -> bool {
    use std::fs;
    use std::os::unix::fs::PermissionsExt;
    
    match fs::metadata(&path) {
        Ok(metadata) => {
            // Check if file exists and is executable
            #[cfg(unix)]
            {
                let permissions = metadata.permissions();
                permissions.mode() & 0o111 != 0
            }
            #[cfg(windows)]
            {
                // On Windows, check if file exists and has .exe extension
                path.ends_with(".exe") && metadata.is_file()
            }
        }
        Err(_) => false,
    }
}

#[command]
pub fn make_executable(path: String) -> Result<(), String> {
    #[cfg(unix)]
    {
        use std::fs;
        use std::os::unix::fs::PermissionsExt;
        
        let metadata = fs::metadata(&path)
            .map_err(|e| format!("Failed to get file metadata: {}", e))?;
        
        let mut permissions = metadata.permissions();
        permissions.set_mode(permissions.mode() | 0o755); // Add execute permissions
        
        fs::set_permissions(&path, permissions)
            .map_err(|e| format!("Failed to set file permissions: {}", e))?;
    }
    
    #[cfg(windows)]
    {
        // On Windows, no need to set execute permissions
        // Files with .exe extension are automatically executable
    }
    
    Ok(())
}

// Don't forget to add these commands to your Tauri builder:
// In your main.rs file:
/*
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_platform,
            get_ffmpeg_version,
            check_file_executable,
            make_executable
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
*/