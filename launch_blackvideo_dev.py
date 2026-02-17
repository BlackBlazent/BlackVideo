import subprocess
import os

# Path to your BlackVideo project
PROJECT_PATH = r"C:\Users\Vilma E. Agripo\Documents\JednazLonestamp\Projects\Computer.Programs\BlackBlazent\Projects\BlackVideo\BlackVideo"

def launch_blackvideo():
    if not os.path.exists(PROJECT_PATH):
        print("❌ Project path not found!")
        return

    # Command to run inside terminal
    command = f'cd /d "{PROJECT_PATH}" && pnpm run tauri dev'

    # Open Windows Terminal and execute command
    subprocess.Popen([
        "wt",
        "cmd",
        "/k",
        command
    ])

    print("✅ BlackVideo launcher started in Windows Terminal.")

if __name__ == "__main__":
    launch_blackvideo()
