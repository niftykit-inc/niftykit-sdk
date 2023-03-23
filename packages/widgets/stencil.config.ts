import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'widgets',
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
  plugins: [sass({ includePaths: ['./node_modules'] })],
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
