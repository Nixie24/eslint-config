import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { configs as tsConfigs, config as tsConfig } from "typescript-eslint";
import globals from "globals";
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import stylisticPlugin from "@stylistic/eslint-plugin";
import { configs as securityPlugin } from "eslint-plugin-security";

import type { InfiniteDepthConfigWithExtends, Rules } from "./types";
import { Linter } from "eslint";

interface DefineConfigParams {
    root: string;
    ignoreFiles?: string[];
    configs?: InfiniteDepthConfigWithExtends;
}

export function defineConfig({
    root,
    ignoreFiles = [],
    configs = [],
}: DefineConfigParams) {
    // 给 rules 合并默认值，并显式类型标注
    const mergedRules: Partial<Rules> = {
        "no-empty-pattern": "off",
        "@stylistic/array-bracket-newline": ["warn", { multiline: true, minItems: 3 }],
        "@stylistic/jsx-self-closing-comp": "warn",
        "@stylistic/max-len": ["warn", { code: 120, ignoreUrls: true }],
        "@stylistic/operator-linebreak": ["warn", "before"],
        "@stylistic/newline-per-chained-call": ["warn", { ignoreChainWithDepth: 4 }],
    };

    const config = tsConfig(
        ignoreFiles.map(f => includeIgnoreFile(f)),
        {
            extends: [
                js.configs.recommended,
                tsConfigs.strictTypeChecked,
                tsConfigs.stylistic,
                importX.flatConfigs.recommended,
                importX.flatConfigs.typescript,
                importX.flatConfigs.react,
                securityPlugin.recommended,
                stylisticPlugin.configs.customize({
                    jsx: true,
                    indent: 4,
                    quotes: "double",
                    semi: true,
                    severity: "warn",
                }),
            ],
            settings: {
                "import-x/resolver-next": [
                    createTypeScriptImportResolver(),
                    createNodeResolver(),
                ],
            },
            languageOptions: {
                ecmaVersion: "latest",
                globals: { ...globals.browser, ...globals.node, ...globals.es2025 },
                parserOptions: { projectService: true, tsconfigRootDir: root },
            },
            rules: mergedRules,
        },
        configs,
    );

    return config as Linter.Config;
}
