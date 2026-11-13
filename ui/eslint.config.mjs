import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    ignores: ['.next/**', 'coverage/**', 'out/**', 'build/**', 'next-env.d.ts'],
}, {
    extends: [
        ...compat.extends('eslint:recommended'),
        ...compat.extends('plugin:react/recommended'),
        ...compat.extends('plugin:@typescript-eslint/recommended'),
        ...nextCoreWebVitals,
        ...compat.extends('prettier')
    ],

    plugins: {
        react,
        '@typescript-eslint': typescriptEslint,
        '@stylistic': stylistic,
        tsdoc,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
    },

    rules: {
        '@stylistic/max-len': ['warn', {
            code: 170,
        }],

        '@stylistic/eol-last': ['error', 'always'],

        '@stylistic/quotes': ['error', 'single', {
            allowTemplateLiterals: true,
        }],

        '@stylistic/arrow-parens': 'off',
        '@stylistic/linebreak-style': 'off',

        'react/function-component-definition': [2, {
            namedComponents: 'arrow-function',
        }],

        'tsdoc/syntax': 'warn',
        'func-names': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': 'off',
        'no-return-assign': 'off',
        'prefer-arrow-callback': 'off',
    },
}, {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    extends: [...compat.extends('plugin:testing-library/react')],
}]);
