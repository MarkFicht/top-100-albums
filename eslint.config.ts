import vue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import prettierSkip from '@vue/eslint-config-prettier/skip-formatting'
import vitest from '@vitest/eslint-plugin'
// @ts-expect-error: ESM-only
import cypress from 'eslint-plugin-cypress/flat'
import oxlint from 'eslint-plugin-oxlint'

const vueParser = await import('vue-eslint-parser')
const tsParser = await import('@typescript-eslint/parser')

export default defineConfigWithVueTs(
  // --- 📁 Main files
  {
    name: 'files-to-lint',
    files: ['**/*.{ts,tsx,vue}'],
  },

  // --- ❌ Ignor build/test/coverage
  {
    name: 'ignored-files',
    ignores: ['**/dist/**', '**/coverage/**', '**/.output/**'],
  },

  // --- 🧠 Vue setup
  {
    name: 'vue-files',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser.default,
      parserOptions: {
        parser: tsParser.default,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
    },
    rules: {
      ...vue.configs['vue3-essential']?.rules,
      'vue/no-unused-components': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },

  // --- 🧠 TypeScript + Vue TS
  vueTsConfigs.recommended,

  // --- 🧪 Vitest
  {
    ...vitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  // --- 🧪 Cypress
  {
    ...cypress.configs.recommended,
    files: ['cypress/**/*.{js,ts,jsx,tsx}'],
  },

  // --- 🧼 Oxlint
  ...oxlint.configs['flat/recommended'],

  // --- 🧹 Skip Prettier
  prettierSkip,

  // --- 🧹 Disable unused vars in Vue
  {
    name: 'disable-unused-vars-in-vue',
    files: ['**/*.vue'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
)
