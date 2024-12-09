import js from '@eslint/js';
import globals from 'globals';
import { configs as tsConfigs } from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    ignores: ['dist'], // Ignore the 'dist' folder
    files: ['**/*.{ts,tsx,js,jsx}'], // Target TS, TSX, JS, and JSX files
    languageOptions: {
      ecmaVersion: 2020, // Enable ECMAScript 2020 features
      globals: globals.browser, // Add browser globals
      parser: '@typescript-eslint/parser', // Use the TypeScript parser
    },
    plugins: {
      prettier: 'eslint-plugin-prettier', // Integrate Prettier as a plugin
    },
    extends: [
      'plugin:prettier/recommended', // Use Prettier's recommended config
    ],
    rules: {
      'prettier/prettier': 'warn', // Highlight Prettier issues as warnings
    },
  },
];
