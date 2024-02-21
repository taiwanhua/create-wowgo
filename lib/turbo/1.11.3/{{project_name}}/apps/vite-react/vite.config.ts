import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // https://dev.to/boostup/uncaught-referenceerror-process-is-not-defined-12kg
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        // "@/src": path.resolve(__dirname, "src"),
        "@": path.resolve(__dirname),
      },
    },
    plugins: [react()],
  };
});

// env :
// VITE_API_URL
