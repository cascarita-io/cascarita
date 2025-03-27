import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    allowedHosts: ["app.cascarita.io"],
  },

  plugins: [
    tsconfigPaths(),
    react(),
    sentryVitePlugin({
      org: "cascarita-org",
      project: "javascript-react",
    }),
  ],

  build: {
    sourcemap: true,
  },
});
