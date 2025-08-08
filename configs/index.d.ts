import { type Linter } from "eslint";
import { type ESLintRules } from "eslint/rules";
import { type RuleOptions } from "@stylistic/eslint-plugin";
import { type ConfigArray } from "typescript-eslint";

type StylisticRules = {
    [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
};

export type Rules = Partial<StylisticRules> & Partial<ESLintRules>;

export declare function defineConfig({ dirname, ignoreFiles, rules }: {
    dirname: string;
    ignoreFiles?: string[];
    rules?: Rules;
}): ConfigArray;
