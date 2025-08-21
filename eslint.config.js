import { config as baseConfig } from "@halvaradop/eslint-config/base"
import { config as reactConfig } from "@halvaradop/eslint-config/react"
import { config as tsConfig } from "@halvaradop/eslint-config/typescript"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([...baseConfig, ...tsConfig, ...reactConfig, globalIgnores(["tsup.config.ts"])])
