// Proxy server

import { exec } from 'child_process';
import os from 'os';
import path from 'path';

const isWindows = os.platform() === 'win32';
const scriptPath = isWindows 
  ? 'src-tauri/youtube-proxy/start-proxy.bat' 
  : 'src-tauri/youtube-proxy/start-proxy.sh';

console.log(`🚀 Starting proxy on ${os.platform()}...`);

const proxyProcess = exec(scriptPath, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) console.error(`Stderr: ${stderr}`);
  console.log(`Stdout: ${stdout}`);
});

// Keep the process alive or pipe output
proxyProcess.stdout?.pipe(process.stdout);