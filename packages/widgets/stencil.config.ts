import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { sass } from '@stencil/sass';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  namespace: 'widgets',
  env: {
    projectId: process.env.PROJECT_ID,
  },
  rollupPlugins: {
    before: [
      rollupCommonjs({
        transformMixedEsModules: true,
        sourceMap: true,
        ignoreGlobal: true,
      }),
    ],
    after: [
      nodePolyfills(),
    ],
  },
  plugins: [sass({ includePaths: ['./node_modules', '../../node_modules'] })],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
