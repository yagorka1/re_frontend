// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  {
    ignores: ['dist/**', '.angular/**', 'coverage/**', 'src/index.html'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/typedef': [
        'error',
        {
          variableDeclaration: true,
          memberVariableDeclaration: true,
          parameter: true,
          propertyDeclaration: true,
        },
      ],
      // Conflicts with the explicit-typedef rule above: both disagree on whether a type
      // annotation is redundant for literal-initialized values.
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'no-public' } },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: "Use the '@/*' path alias instead of parent-relative imports.",
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
  // Formatting is Prettier's job — keep ESLint out of it. Must stay last.
  prettier,
]);
