import { type Linter } from "eslint";
import { type ESLintRules } from "eslint/rules";
import { type RuleOptions } from "@stylistic/eslint-plugin";

type StylisticRules = {
    [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>
};

export type Rules = Partial<StylisticRules> & Partial<ESLintRules>;
