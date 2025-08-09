# @nix24/eslint-config

> ✨ Modern ESLint config for TypeScript-first projects.  
> 🧠 Supports React and Vue.  
> 🚀 Built on ESLint v9 Flat Config.  
> 🎨 Formatting by Stylistic — no need for Prettier.

## Usage

Install the package:

```bash
npm install --save-dev @nix24/eslint-config eslint
```

Then, create a `eslint.config.ts` or `eslint.config.js` file in your project root and add the following:
```ts
import { defineConfig } from "@nix24/eslint-config";

export default defineConfig({
    dirname: import.meta.dirname,
});
```