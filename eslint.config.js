import { baseConfig } from "@halvaradop/eslint-config/base"
import { reactConfig } from "@halvaradop/eslint-config/react"
import { tsConfig } from "@halvaradop/eslint-config/typescript"

export default [...baseConfig, ...reactConfig, ...tsConfig]
