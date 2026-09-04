/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Feature folders under src/app/features are the usual scope.
    'scope-case': [2, 'always', 'kebab-case'],
    'body-max-line-length': [0],
  },
};
