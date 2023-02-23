module.exports = {
  extends: '../js-config/eslint/react/typescript.eslintrc.js',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      settings: {
        'import/resolver': {
          alias: {
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
          },
        },
      },
    },
  ],
};