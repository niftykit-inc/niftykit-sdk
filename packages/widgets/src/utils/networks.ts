import { Chain, PublicClient, createPublicClient, http } from 'viem';
import {
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  arbitrumNova,
  optimism,
  optimismSepolia,
  polygon,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  cronos,
  cronosTestnet,
} from 'viem/chains';
import { Env } from '@stencil/core';

type Network = {
  chain: Chain;
  jsonRpcProviderUrl: string;
};

export const networks: Network[] = [
  {
    chain: mainnet,
    jsonRpcProviderUrl: Env.ETH_MAINNET_RPC,
  },
  {
    chain: sepolia,
    jsonRpcProviderUrl: Env.ETH_SEPOLIA_RPC,
  },
  {
    chain: arbitrum,
    jsonRpcProviderUrl: Env.ARBITRUM_MAINNET_RPC,
  },
  {
    chain: arbitrumSepolia,
    jsonRpcProviderUrl: Env.ARBITRUM_SEPOLIA_RPC,
  },
  {
    chain: arbitrumNova,
    jsonRpcProviderUrl: Env.ARBITRUM_NOVA_RPC,
  },
  {
    chain: optimism,
    jsonRpcProviderUrl: Env.OPTIMISM_MAINNET_RPC,
  },
  {
    chain: optimismSepolia,
    jsonRpcProviderUrl: Env.OPTIMISM_SEPOLIA_RPC,
  },
  {
    chain: polygon,
    jsonRpcProviderUrl: Env.POLYGON_MAINNET_RPC,
  },
  {
    chain: avalanche,
    jsonRpcProviderUrl: Env.AVALANCHE_MAINNET_RPC,
  },
  {
    chain: avalancheFuji,
    jsonRpcProviderUrl: Env.AVALANCHE_FUJI_RPC,
  },
  {
    chain: base,
    jsonRpcProviderUrl: Env.BASE_MAINNET_RPC,
  },
  {
    chain: baseSepolia,
    jsonRpcProviderUrl: Env.BASE_SEPOLIA_RPC,
  },
  {
    chain: cronos,
    jsonRpcProviderUrl: Env.CRONOS_MAINNET_RPC,
  },
  {
    chain: cronosTestnet,
    jsonRpcProviderUrl: Env.CRONOS_TESTNET_RPC,
  },
];

export const viemClients: PublicClient[] = networks.map((network) =>
  createPublicClient({
    chain: network.chain,
    batch: {
      multicall: true,
    },
    transport: http(network.jsonRpcProviderUrl, {
      batch: true,
    }),
  })
);

export const getViemClientByChainId = (chainId: number): PublicClient => {
  const client = viemClients.find(
    (client: PublicClient) => client.chain && client.chain.id === chainId
  );

  if (!client) {
    throw new Error(`No client found for chainId ${chainId}`);
  }

  return client;
};
