import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Has to be put last, so it gets the chance to override other configs.
  globalIgnores(['dist/**', 'node_modules/**', '.next/**', 'next-env.d.ts']),
  eslintConfigPrettier
]);

export default eslintConfig;
