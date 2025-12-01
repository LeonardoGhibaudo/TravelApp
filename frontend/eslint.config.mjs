import eslintConfig from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "eslint-plugin-next";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // Recommended ESLint + TypeScript
  eslintConfig.configs.recommended,
  ...tseslint.configs.recommended,

  // Next.js core rules
  nextPlugin.configs["core-web-vitals"],

  // Disabilita regole che confliggono con Prettier
  prettier,

  // Plugin Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
