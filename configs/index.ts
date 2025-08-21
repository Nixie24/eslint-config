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
        "@stylistic/no-extra-parens": "warn",
        "@stylistic/no-extra-semi": "warn",
        "@stylistic/array-bracket-newline": ["warn", { multiline: true, minItems: 3 }],
        "@stylistic/jsx-self-closing-comp": "warn",
        "@stylistic/max-len": ["warn", { code: 120, ignoreUrls: true }],
        "@stylistic/operator-linebreak": ["warn", "before"],
        "@stylistic/newline-per-chained-call": ["warn", { ignoreChainWithDepth: 4 }],
        "@stylistic/jsx-sort-props": [
            "warn", {
                ignoreCase: true,
                callbacksLast: true,
                shorthandFirst: false,
                shorthandLast: true,
                multiline: "last",
                reservedFirst: true,
                locale: "en",
            },
        ],
        "@stylistic/array-bracket-spacing": ["warn", "never"],
        "@stylistic/arrow-parens": ["warn", "as-needed"],
        "@stylistic/block-spacing": ["warn", "always"],
        "@stylistic/brace-style": [
            "warn", "1tbs", { allowSingleLine: true },
        ],
        "@stylistic/comma-dangle": ["warn", "always-multiline"],
        "@stylistic/comma-spacing": ["warn", { before: false, after: true }],
        "@stylistic/comma-style": ["warn", "last"],
        "@stylistic/dot-location": ["warn", "property"],
        "@stylistic/function-call-spacing": ["warn", "never"],
        "@stylistic/indent": [
            "warn", 4, { SwitchCase: 1 },
        ],
        "@stylistic/key-spacing": ["warn", { beforeColon: false, afterColon: true }],
        "@stylistic/keyword-spacing": ["warn", { before: true, after: true }],
        "@stylistic/no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
        "@stylistic/object-curly-newline": ["warn", { multiline: true, consistent: true }],
        "@stylistic/object-curly-spacing": ["warn", "always"],
        "@stylistic/quote-props": ["warn", "as-needed"],
        "@stylistic/quotes": [
            "warn", "double", { avoidEscape: true },
        ],
        "@stylistic/semi": ["warn", "always"],
        "@stylistic/space-before-blocks": ["warn", "always"],
        "@stylistic/space-before-function-paren": ["warn", "never"],
        "@stylistic/space-in-parens": ["warn", "never"],
        "@stylistic/space-infix-ops": "warn",
        "@stylistic/spaced-comment": [
            "warn", "always", { markers: ["/"] },
        ],
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
