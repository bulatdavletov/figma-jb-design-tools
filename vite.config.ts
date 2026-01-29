import { defineConfig } from "vite"
import preact from "@preact/preset-vite"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [preact()],
  root: resolve(__dirname, "src/preview"),
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          // create-figma-plugin uses `import '!../css/base.css'` (webpack-style).
          // Vite's dependency scanner (esbuild) can't resolve the leading `!`.
          name: "strip-leading-bang-from-imports",
          setup(build) {
            build.onResolve({ filter: /^!/ }, (args) => {
              return { path: resolve(args.resolveDir, args.path.slice(1)) }
            })
          },
        },
      ],
    },
  },
  build: {
    outDir: resolve(__dirname, "dist-preview"),
    emptyOutDir: true,
  },
})

