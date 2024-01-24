import Diamond from '@niftykit/diamond';
import { Env } from '@stencil/core';
import { createStore } from '@stencil/store';
import {
  arbitrum,
  arbitrumGoerli,
  arbitrumNova,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  base,
  baseGoerli,
  avalanche,
  avalancheFuji,
} from 'viem/chains';
import { watchClient } from '@wagmi/core';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { clientToProvider, clientToSigner } from '../utils/adapters';
import type { Account, Client, Chain, Transport } from 'viem';

const projectId = Env.projectId ?? '';
const metadata = {
  name: 'NiftyKit',
  description:
    'Sign Up for a NiftyKit account and create your first digital collectible in just minutes, instead of hours and days.',
  url: 'https://app.niftykit.com',
  icons: ['https://app.niftykit.com/logo-new.svg'],
  verifyUrl: 'https://niftykit.com',
};
const availableChains: Chain[] = [
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumNova,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  base,
  baseGoerli,
  avalanche,
  avalancheFuji,
];

const { state } = createStore<{
  modal?: ReturnType<typeof createWeb3Modal>;
  config: ReturnType<typeof defaultWagmiConfig>;
  walletClient?: Client<Transport, Chain, Account | undefined>;
  publicClient?: Client<Transport, Chain>;
  diamond?: Diamond | null;
  chain?: Chain;
  isDev?: boolean;
}>({
  config: defaultWagmiConfig({
    chains: [availableChains[0], ...availableChains],
    projectId,
    metadata,
  }),
});

export async function initialize(
  collectionId: string,
  isDev?: boolean
): Promise<void> {
  const data = await Diamond.getCollectionData(collectionId, isDev);
  if (!data) {
    throw new Error('Invalid collection.');
  }

  const chains = availableChains.filter((chain) => chain.id === data.chainId);
  const wagmiConfig = defaultWagmiConfig({
    chains: [chains[0]],
    projectId,
    metadata,
  });
  const client = wagmiConfig.getClient();

  state.config = wagmiConfig;
  state.isDev = isDev;
  state.publicClient = client;
  state.modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains: [chains[0]],
    themeVariables: {
      '--w3m-font-family': 'Chivo, sans-serif',
      '--w3m-z-index': 99999,
    },
    termsConditionsUrl:
      'https://niftykit.notion.site/Terms-of-Use-d81954b4fbaf4d5da2f52a39722d532a',
    privacyPolicyUrl:
      'https://niftykit.notion.site/Privacy-Policy-6afe9633a54b4119b66a3ea1ab79cf50',
  });
  state.chain = chains[0];
  state.diamond = await Diamond.create(
    clientToProvider(client),
    collectionId,
    data,
    isDev
  );

  watchClient(wagmiConfig, {
    onChange: async (client) => {
      if (!client.account) {
        return;
      }
      state.diamond = await Diamond.create(
        clientToSigner(client),
        collectionId,
        data,
        isDev
      );
      state.walletClient = client;
    },
  });
}

export default state;
