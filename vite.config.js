import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works when served from a GitHub Pages
// project subpath (https://<user>.github.io/<repo>/) without any
// repo-name-specific configuration.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
