import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";



export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // Explicitly tell Vite to use the modern Dart Sass API
        api: 'modern',
      },
    },
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths()
  ],
  server: {
    host: "0.0.0.0"
  }
});
