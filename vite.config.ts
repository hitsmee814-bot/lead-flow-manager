import { defineConfig, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },

  plugins: [
    react(),

    // 🔥 FIXED: middleware inside plugin
    {
      name: "redirect-root",
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/") {
            res.writeHead(302, { Location: "/bonhomiee" });
            res.end();
            return;
          }
          next();
        });
      },
    },

    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));