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

type Network = {
  chain: Chain;
  jsonRpcProviderUrl: string;
};

export const networks: Network[] = [
  {
    chain: mainnet,
    jsonRpcProviderUrl:
      'https://eth-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: sepolia,
    jsonRpcProviderUrl:
      'https://eth-sepolia.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: arbitrum,
    jsonRpcProviderUrl:
      'https://arb-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: arbitrumSepolia,
    jsonRpcProviderUrl:
      'https://arb-sepolia.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: arbitrumNova,
    jsonRpcProviderUrl:
      'https://arbnova-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: optimism,
    jsonRpcProviderUrl:
      'https://opt-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: optimismSepolia,
    jsonRpcProviderUrl:
      'https://opt-sepolia.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: polygon,
    jsonRpcProviderUrl:
      'https://polygon-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: avalanche,
    jsonRpcProviderUrl:
      'https://avax-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: avalancheFuji,
    jsonRpcProviderUrl:
      'https://avax-fuji.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: base,
    jsonRpcProviderUrl:
      'https://base-mainnet.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: baseSepolia,
    jsonRpcProviderUrl:
      'https://base-sepolia.g.alchemy.com/v2/vjbX08ftNm-RfThBFCDoByeGXrwRebXC',
  },
  {
    chain: cronos,
    jsonRpcProviderUrl:
      'https://svc.blockdaemon.com/cronos/mainnet/native/http-rpc?apiKey=zpka_807e0387c9024a39a725344002fcc359_0a98a78a',
  },
  {
    chain: cronosTestnet,
    jsonRpcProviderUrl: 'https://evm-t3.cronos.org',
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
