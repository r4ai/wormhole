import { resolve } from "node:path"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import tsconfigPaths from "vite-tsconfig-paths"

const root = import.meta.dirname
const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [solid(), tsconfigPaths()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
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
  build: {
    rollupOptions: {
      input: {
        search: resolve(root, "src/search/index.html"),
        settings: resolve(root, "src/settings/index.html"),
      },
    },
  },
}))
