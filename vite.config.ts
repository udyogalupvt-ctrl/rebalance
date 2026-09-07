import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // The route-level dynamic imports already carve out the admin console and
    // the assessment form. These split the remaining vendor weight so a
    // returning visitor re-uses cached chunks instead of re-downloading one
    // monolith whenever any application code changes.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Normalise separators first. On Windows the module id arrives with
          // backslashes, so a rule written as "/react/" silently never
          // matched and React was landing in whichever chunk happened to
          // claim it — at one point a chunk named "dnd" that contained no
          // dnd-kit at all.
          const path = id.split("\\").join("/");
          if (!path.includes("/node_modules/")) return undefined;

          // Firebase is the single heaviest dependency, and the marketing
          // pages only touch Firestore. Keeping auth and messaging separate
          // means the admin-only halves are never on the critical path.
          if (/\/(@firebase\/auth|firebase\/auth)\//.test(path)) return "firebase-auth";
          if (/\/(@firebase\/messaging|firebase\/messaging)\//.test(path))
            return "firebase-messaging";
          if (/\/(@firebase|firebase)\//.test(path)) return "firebase";

          if (/\/(framer-motion|motion-dom|motion-utils)\//.test(path)) return "motion";
          if (path.includes("/@tanstack/")) return "tanstack";
          if (path.includes("/@dnd-kit/")) return "dnd";
          if (/\/(recharts|d3-[a-z]+)\//.test(path)) return "charts";
          if (/\/(react|react-dom|scheduler|react-is)\//.test(path)) return "react";

          // Isolated deliberately. Grouping everything else into one "vendor"
          // chunk co-locates modules with very different lifetimes: zod is
          // used only by the assessment schemas and date-fns only by the
          // admin console, but sharing a chunk with Radix and Lenis — which
          // the marketing pages do need — dragged both onto the critical
          // path. Their own chunks stay lazy.
          if (path.includes("/zod/")) return "zod";
          if (path.includes("/date-fns/")) return "date-fns";

          return "vendor";
        },
      },
    },
    // Warn only for chunks genuinely worth attention.
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 8080,
    host: true,
  },
});
