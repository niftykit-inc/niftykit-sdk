import { Chain, PublicClient, createPublicClient, http } from 'viem';
import {
  mainnet,
  goerli,
  sepolia,
  arbitrum,
  arbitrumGoerli,
  arbitrumSepolia,
  arbitrumNova,
  optimism,
  optimismGoerli,
  optimismSepolia,
  polygon,
  polygonMumbai,
  avalanche,
  avalancheFuji,
  base,
  baseGoerli,
  baseSepolia,
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
    chain: goerli,
    jsonRpcProviderUrl:
      'https://eth-goerli.g.alchemy.com/v2/YK7d6jWdXygPvZOYEGQfCfMAqnQauGn8',
  },
  {
    chain: sepolia,
    jsonRpcProviderUrl:
      'https://eth-sepolia.g.alchemy.com/v2/uvyWhQbTPPGooshV0w3mNFygR_C3w4PI',
  },
  {
    chain: arbitrum,
    jsonRpcProviderUrl:
      'https://arb-mainnet.g.alchemy.com/v2/6WePBJe7ezhGQytaMlCdBnYLphA8Rd_y',
  },
  {
    chain: arbitrumGoerli,
    jsonRpcProviderUrl:
      'https://arb-goerli.g.alchemy.com/v2/K_kUP-i_aujVzmi_VJSMSzSCfzU9qEHD',
  },
  {
    chain: arbitrumSepolia,
    jsonRpcProviderUrl:
      'https://arb-sepolia.g.alchemy.com/v2/F4Azd35y2l1518Lf8wJpMfhQA-mZ9bYl',
  },
  {
    chain: arbitrumNova,
    jsonRpcProviderUrl:
      'https://solemn-quaint-arm.nova-mainnet.quiknode.pro/d5521f20cc5b7f05718f4cf6a8a46cfebd4aa9ff',
  },
  {
    chain: optimism,
    jsonRpcProviderUrl:
      'https://opt-mainnet.g.alchemy.com/v2/6vRmau94Z4Zb8C8nxL3EC3MVjxs1T5KW',
  },
  {
    chain: optimismGoerli,
    jsonRpcProviderUrl:
      'https://opt-goerli.g.alchemy.com/v2/AFIR5xe4IA0AhroAM8ZY4rtu9wULg2ub',
  },
  {
    chain: optimismSepolia,
    jsonRpcProviderUrl:
      'https://opt-sepolia.g.alchemy.com/v2/3gqr1mM27myJzimzb_gqLYGgfIo1SwuI',
  },
  {
    chain: polygon,
    jsonRpcProviderUrl:
      'https://polygon-mainnet.g.alchemy.com/v2/uwvzgvlHPLuvAEBbzVVzvAwS5IAw76A6',
  },
  {
    chain: polygonMumbai,
    jsonRpcProviderUrl:
      'https://polygon-mumbai.g.alchemy.com/v2/6zcZ6M219fOMT5cjSAHzkVhnRVT4F2j4',
  },
  {
    chain: avalanche,
    jsonRpcProviderUrl:
      'https://bitter-late-film.avalanche-mainnet.quiknode.pro/a1eafa70d381641f271230d2d849219afccfad62/ext/bc/C/rpc',
  },
  {
    chain: avalancheFuji,
    jsonRpcProviderUrl:
      'https://frosty-indulgent-firefly.avalanche-testnet.quiknode.pro/3297380f2a3b4d0781ebb87c66aefd8b4b8fda4e/ext/bc/C/rpc',
  },
  {
    chain: base,
    jsonRpcProviderUrl:
      'https://base-mainnet.g.alchemy.com/v2/-onKT4vOyp-azOD2EVjlaqjmKrhQpk50',
  },
  {
    chain: baseGoerli,
    jsonRpcProviderUrl:
      'https://base-goerli.g.alchemy.com/v2/UvTFPh5poukR01eovAjxmtMIFRTD8PhU',
  },
  {
    chain: baseSepolia,
    jsonRpcProviderUrl:
      'https://base-sepolia.g.alchemy.com/v2/1Al67WdVc_GgVrWZ2WQVnDS-AG5XzI57',
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
