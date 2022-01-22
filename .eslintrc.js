module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    semi: [2, 'always'],
    indent: 'off'
  }
};
