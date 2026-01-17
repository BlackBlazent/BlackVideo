import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  resolve: {
    alias: {
      // This creates a shortcut so "@appdata" points to your folder
      '@appdata': resolve(__dirname, './AppData'),
    },
  },
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    fs: {
      // Allow Vite to access the AppData folder since it's outside of 'src'
      allow: ['.'] 
    },
    port: 1420,
    strictPort: true,
    host: host || true,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
