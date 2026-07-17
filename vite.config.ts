import { defineConfig } from "vite";
import vinext from "vinext";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { fileURLToPath } from "node:url";

export default defineConfig({
  optimizeDeps: {
    exclude: ["lucide-react"],
    // Pre-bundle heavy deps up front so the first request isn't stalled by
    // on-demand optimization (and avoid mid-session re-optimize reloads).
    include: ["framer-motion", "three", "@react-three/fiber", "@react-three/rapier"],
  },
  resolve: {
    alias: {
      "@app": fileURLToPath(new URL("./src/app", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@content": fileURLToPath(new URL("./src/content", import.meta.url)),
      "@context": fileURLToPath(new URL("./src/context", import.meta.url)),
      "@hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
      "@lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
      "@locales": fileURLToPath(new URL("./src/locales", import.meta.url)),
    },
  },
  plugins: [
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    vinext({
      cache: {
        data: kvDataAdapter({ appPrefix: "personal-website" }),
      },
    }),
    cloudflare({
      configPath: process.env.WRANGLER_CONFIG_PATH || undefined,
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
