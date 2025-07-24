// vite.config.ts
import { defineConfig } from "file:///E:/message-automation-command-center-01903b611ece9e9004db00927142f1ce9c24edd2/node_modules/vite/dist/node/index.js";
import react from "file:///E:/message-automation-command-center-01903b611ece9e9004db00927142f1ce9c24edd2/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///E:/message-automation-command-center-01903b611ece9e9004db00927142f1ce9c24edd2/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "E:\\message-automation-command-center-01903b611ece9e9004db00927142f1ce9c24edd2";
var vite_config_default = defineConfig(({ mode }) => ({
  base: "/",
  publicDir: "public",
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    },
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"]
  },
  define: {
    "process.env.NODE_ENV": '"production"'
  },
  esbuild: {
    loader: "tsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  build: {
    target: "es2015",
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    chunkSizeWarningLimit: 1500,
    // increases warning limit to 1500 kB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts"],
          ui: ["@/components/ui"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxtZXNzYWdlLWF1dG9tYXRpb24tY29tbWFuZC1jZW50ZXItMDE5MDNiNjExZWNlOWU5MDA0ZGIwMDkyNzE0MmYxY2U5YzI0ZWRkMlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcbWVzc2FnZS1hdXRvbWF0aW9uLWNvbW1hbmQtY2VudGVyLTAxOTAzYjYxMWVjZTllOTAwNGRiMDA5MjcxNDJmMWNlOWMyNGVkZDJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L21lc3NhZ2UtYXV0b21hdGlvbi1jb21tYW5kLWNlbnRlci0wMTkwM2I2MTFlY2U5ZTkwMDRkYjAwOTI3MTQyZjFjZTljMjRlZGQyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIGJhc2U6ICcvJyxcclxuICBwdWJsaWNEaXI6ICdwdWJsaWMnLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgICBleHRlbnNpb25zOiBbJy50c3gnLCAnLnRzJywgJy5qc3gnLCAnLmpzJywgJy5qc29uJ10sXHJcbiAgfSxcclxuICBkZWZpbmU6IHtcclxuICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6ICdcInByb2R1Y3Rpb25cIicsXHJcbiAgfSxcclxuICBlc2J1aWxkOiB7XHJcbiAgICBsb2FkZXI6ICd0c3gnLFxyXG4gICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuW3RqXXN4PyQvLFxyXG4gICAgZXhjbHVkZTogW10sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcclxuICAgIG91dERpcjogJ2Rpc3QnLFxyXG4gICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTUwMCwgLy8gaW5jcmVhc2VzIHdhcm5pbmcgbGltaXQgdG8gMTUwMCBrQlxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgIGNoYXJ0czogWydyZWNoYXJ0cyddLFxyXG4gICAgICAgICAgdWk6IFsnQC9jb21wb25lbnRzL3VpJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9LFxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgaW5jbHVkZTogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gIH0sXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2WixTQUFTLG9CQUFvQjtBQUMxYixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsTUFBTTtBQUFBLEVBQ04sV0FBVztBQUFBLEVBQ1gsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxJQUNBLFlBQVksQ0FBQyxRQUFRLE9BQU8sUUFBUSxPQUFPLE9BQU87QUFBQSxFQUNwRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sd0JBQXdCO0FBQUEsRUFDMUI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ1o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLFdBQVc7QUFBQSxJQUNYLFFBQVE7QUFBQSxJQUNSLHVCQUF1QjtBQUFBO0FBQUEsSUFDdkIsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLFVBQzdCLFFBQVEsQ0FBQyxVQUFVO0FBQUEsVUFDbkIsSUFBSSxDQUFDLGlCQUFpQjtBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLEVBQ3BEO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
