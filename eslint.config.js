import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'android']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-empty": "off",
      "no-undef": "off",
      "no-case-declarations": "off",
      "no-useless-escape": "off",
      "no-prototype-builtins": "off",
      "no-useless-assignment": "off",
      "react-refresh/only-export-components": "off"
    }
  },
])
