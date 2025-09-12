import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "")
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@/hooks": resolve("src/hooks"),
        "@/assets": resolve("src/assets"),
        "@/components": resolve("src/components"),
        "@/utils": resolve("src/utils"),
        "@/pages": resolve("src/pages"),
        "@/services": resolve("src/services"),
        "@/app": resolve("src/app"),
        "@/features": resolve("src/features"),
        "@/shared": resolve("src/shared"),
        "@/public": resolve("public")
      }
    },
    build: {
      outDir: "build"
    }
  }
})
