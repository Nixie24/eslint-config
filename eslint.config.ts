import { fileURLToPath } from "node:url";
import { defineConfig } from "./configs";

export default defineConfig({
    root: import.meta.dirname,
    ignoreFiles: [fileURLToPath(new URL(".gitignore", import.meta.url))],
});
