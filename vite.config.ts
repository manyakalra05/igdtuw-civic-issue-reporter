import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

<!-- Update 2025-01-07T08:14:43+05:30 -->
<!-- Update 2025-02-25T08:22:13+05:30 -->
<!-- Update 2025-02-25T19:14:13+05:30 -->
<!-- Update 2025-03-01T07:38:19+05:30 -->
<!-- Update 2025-03-10T07:04:26+05:30 -->
<!-- Update 2025-05-13T14:55:47+05:30 -->
<!-- Update 2025-07-19T12:43:26+05:30 -->
<!-- Update 2025-08-17T08:22:45+05:30 -->
<!-- Update 2025-10-06T17:46:13+05:30 -->