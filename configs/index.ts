import { includeIgnoreFile } from "@eslint/compat";
import ESLint from "@eslint/js";
import { configs as TSconfigs, config as generateTSconfig, type ConfigArray } from "typescript-eslint";
import globals from "globals";
import { createNodeResolver, importX } from "eslint-plugin-import-x";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
import stylistic from "@stylistic/eslint-plugin";
import { type Rules } from "./types";
export function defineConfig({
    dirname, ignoreFiles = [], rules = {},
}: {
    dirname: string;
    ignoreFiles?: string[];
    rules?: Rules;
}): ConfigArray {
    rules = {
        "no-empty-pattern": "off",
        "@stylistic/array-bracket-newline": ["warn", { multiline: true, minItems: 3 }],
        "@stylistic/jsx-self-closing-comp": "warn",
        "@stylistic/max-len": ["warn", { code: 120, ignoreUrls: true }],
        "@stylistic/operator-linebreak": ["warn", "before"],
        "@stylistic/newline-per-chained-call": ["warn", { ignoreChainWithDepth: 4 }],
        ...rules,
    };

    return generateTSconfig(
        ignoreFiles.map(file => includeIgnoreFile(file)),
        {
            extends: [
                ESLint.configs.recommended,
                TSconfigs.strictTypeChecked,
                TSconfigs.stylistic,
                importX.flatConfigs.recommended,
                importX.flatConfigs.typescript,
                importX.flatConfigs.react,
                stylistic.configs.customize({
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
                globals: {
                    ...globals.browser,
                    ...globals.node,
                    ...globals.es2025,
                },
                parserOptions: {
                    projectService: true,
                    tsconfigRootDir: dirname,
                },
            },
            rules,
        },
    );
}
