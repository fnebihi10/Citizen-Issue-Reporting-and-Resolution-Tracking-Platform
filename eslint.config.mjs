import { defineConfig, globalIgnores } from 'eslint/config';
import nextTypeScript from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'generate_dataset.js',
    'next-env.d.ts',
  ]),
]);
