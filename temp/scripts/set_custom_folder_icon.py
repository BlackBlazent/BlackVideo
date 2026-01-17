import os
import subprocess
from pathlib import Path

# -----------------------------
# Resolve project root
# -----------------------------
SCRIPT_PATH = Path(__file__).resolve()
PROJECT_ROOT = SCRIPT_PATH.parents[2]  # temp/scripts -> project root

ICON_ROOT = PROJECT_ROOT / "config" / "dev" / "icon"

# -----------------------------
# Folder → icon mapping
# -----------------------------
FOLDER_ICONS = {
    "AppData": "AppData.ico",
    "__docs__": "docs.ico",
    "AppRegistry": "registry.ico",
    "AppRegistry/extensions": "extension.ico",
    "LICENSE": "license.ico",
    "src": "src.ico",
    ".blackblazent": "BlackBlazent.ico",
}

# -----------------------------
# Helpers
# -----------------------------
def set_attributes(path: Path, attrs: str):
    subprocess.run(
        ["attrib", attrs, str(path)],
        shell=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

def write_desktop_ini(folder: Path, icon_path: Path):
    ini_path = folder / "desktop.ini"

    content = f"""[.ShellClassInfo]
IconResource={icon_path},0
"""

    ini_path.write_text(content, encoding="utf-8")

    # Set attributes
    set_attributes(folder, "+s")
    set_attributes(ini_path, "+h +s")

# -----------------------------
# Apply icons
# -----------------------------
for rel_folder, icon_file in FOLDER_ICONS.items():
    folder_path = PROJECT_ROOT / rel_folder
    icon_path = ICON_ROOT / icon_file

    if not folder_path.exists():
        print(f"⚠️ Skipped (missing): {folder_path}")
        continue

    if not icon_path.exists():
        print(f"❌ Icon missing: {icon_path}")
        continue

    write_desktop_ini(folder_path, icon_path)
    print(f"✅ Icon applied: {folder_path}")

print("\n✔ Folder icons applied. Refresh Explorer if needed.")
