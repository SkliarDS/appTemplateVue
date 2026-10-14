import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/public/**']),

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // Свои правила должны идти ПОСЛЕ пресетов — во flat config побеждает последний блок
  {
    name: 'app/rules',
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ym: 'readonly',
        AdriverCounterJS: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-useless-escape': 'warn',
      'no-empty': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/return-in-computed-property': 'off',
    },
  },
])
