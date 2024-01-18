import eslint from '@rollup/plugin-eslint';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json' assert { type: 'json' };

// dev build if watching, prod build if not
const isProduction = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.js', // Adjust the path to your main source file
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'f11y', // Replace with your library's name
      sourcemap: true,
    },
    {
        file: pkg.cdn,
        format: 'umd',
        name: 'f11y', // Replace with your library's name
        sourcemap: true,
    },
    {
        file: pkg.module,
        format: 'es'
    }
  ],
  plugins: [
    eslint({ exclude: 'node_modules/**' }),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    isProduction && terser(),
    isProduction && filesize(),
  ],
};