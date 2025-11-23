import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
        "@/hooks": resolve("src/renderer/src/hooks"),
        "@/assets": resolve("src/renderer/src/assets"),
        "@/store": resolve("src/renderer/src/store"),
        "@/components": resolve("src/renderer/src/components"),
        "@/lib": resolve("src/renderer/src/lib")
      }
    },
    plugins: [react(), tailwindcss()]
  }
});
