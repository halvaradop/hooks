import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src"],
    format: ["cjs", "esm"],
    clean: true,
    dts: true,
    minify: true,
    external: ["react", "react-dom", "@types/react", "@types/react-dom"],
})
