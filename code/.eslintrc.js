module.exports = {
  env: {
    node: true,
    commonjs: true
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin', '@typescript-eslint', 'jest'],
  parserOptions: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './tsconfig.json']
  },
  extends: [
    'standard-with-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // "plugin:prettier/recommended",
    // "prettier",
    'prettier/@typescript-eslint'
    // "plugin:jest/recommended"
  ],
  rules: {
    // 'prettier/prettier': [
    //   'warn',
    //   {
    //     singleQuote: true,
    //     semi: false,
    //     trailingComma: 'none'
    //   }
    // ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    semi: [2, 'never']
  }
}
