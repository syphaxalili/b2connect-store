import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  pluginReact.configs.flat.recommended,
  pluginReactRefresh.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      js,
      react: pluginReact,
      "react-resfresh": pluginReactRefresh
    },
    extends: ["js/recommended"],
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react-refresh/only-export-components": "warn",
      "no-console": "warn"
    }
  }
]);
