import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import rollupCommonjs from '@rollup/plugin-commonjs';
import { sass } from '@stencil/sass';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  namespace: 'widgets',
  env: {
    PROJECT_ID: process.env.PROJECT_ID,
    ETH_MAINNET_RPC: process.env.ETH_MAINNET_RPC,
    ETH_SEPOLIA_RPC: process.env.ETH_SEPOLIA_RPC,
    ARBITRUM_MAINNET_RPC: process.env.ARBITRUM_MAINNET_RPC,
    ARBITRUM_SEPOLIA_RPC: process.env.ARBITRUM_SEPOLIA_RPC,
    ARBITRUM_NOVA_RPC: process.env.ARBITRUM_NOVA_RPC,
    OPTIMISM_MAINNET_RPC: process.env.OPTIMISM_MAINNET_RPC,
    OPTIMISM_SEPOLIA_RPC: process.env.OPTIMISM_SEPOLIA_RPC,
    POLYGON_MAINNET_RPC: process.env.POLYGON_MAINNET_RPC,
    AVALANCHE_MAINNET_RPC: process.env.AVALANCHE_MAINNET_RPC,
    AVALANCHE_FUJI_RPC: process.env.AVALANCHE_FUJI_RPC,
    BASE_MAINNET_RPC: process.env.BASE_MAINNET_RPC,
    BASE_SEPOLIA_RPC: process.env.BASE_SEPOLIA_RPC,
    CRONOS_MAINNET_RPC: process.env.CRONOS_MAINNET_RPC,
    CRONOS_TESTNET_RPC: process.env.CRONOS_TESTNET_RPC,
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
