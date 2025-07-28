import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
    { ignores: ['dist'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            // Clean Code: Variable and Function Naming
            'no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^[A-Z_]',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            camelcase: ['error', { properties: 'never' }],

            // Clean Code: Function Length and Complexity
            'max-lines-per-function': [
                'warn',
                { max: 50, skipBlankLines: true, skipComments: true },
            ],
            complexity: ['warn', { max: 10 }],
            'max-depth': ['error', { max: 4 }],
            'max-params': ['error', { max: 4 }],

            // Clean Code: Code Readability
            'prefer-const': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'arrow-spacing': 'error',
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'eol-last': 'error',

            // Clean Code: Comments and Documentation
            'spaced-comment': ['error', 'always'],
            'multiline-comment-style': ['error', 'starred-block'],

            // React Specific Clean Code Rules
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],

            // Clean Code: Consistent Formatting
            indent: ['error', 4, { SwitchCase: 1 }],
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],

            // Clean Code: Best Practices
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'error',
            'no-alert': 'error',
            'prefer-template': 'error',
            'no-duplicate-imports': 'error',
        },
    },
];
