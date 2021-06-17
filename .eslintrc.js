module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'standard',
    'plugin:jest/recommended',
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': [2, 'always-multiline'],
    'space-before-function-paren': 0,
    'object-curly-spacing': 0,
    'prefer-const': 0,
    'no-unneeded-ternary': ['error', { defaultAssignment: true }],
  },
  // env: {
  //   'jest/globals': true,
  // },
}
