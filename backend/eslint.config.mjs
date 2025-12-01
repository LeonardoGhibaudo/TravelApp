import eslintConfig from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  eslintConfig.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,  // <-- disabilita i conflitti con Prettier
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",   // <-- fa rispettare Prettier
    },
  },
];
