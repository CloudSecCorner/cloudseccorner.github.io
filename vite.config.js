import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          // Split framework + router + helmet into a reusable async vendor chunk
          // so the 37k+ tool catalog never drags React into its lazy bundle.
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|react-helmet|react-scroll)[\\/]/.test(
              id
            )
          ) {
            return "react-vendor";
          }

          // Keep react-markdown and its unified/remark ecosystem isolated.
          if (
            /node_modules[\\/](react-markdown|remark|micromark|mdast|unist|hast|rehype|bail|vfile|property-information|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch|html-url-attributes|decode-named-character-reference|character-entities|trough|unified|hast-util-to-jsx-runtime|@types\/(hast|mdast|unist))/.test(
              id
            )
          ) {
            return "markdown";
          }

          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }

          return undefined;
        },
      },
    },
  },
});
