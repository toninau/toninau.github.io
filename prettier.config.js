/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '**/*.md',
      options: {
        printWidth: 80
      }
    }
  ]
};

export default config;
