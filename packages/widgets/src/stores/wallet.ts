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
} from '@wagmi/chains';
import { watchWalletClient } from '@wagmi/core';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { Chain, PublicClient, WalletClient } from 'viem';
import {
  publicClientToProvider,
  walletClientToSigner,
} from '../utils/adapters';

const projectId = Env.projectId;
const availableChains = [
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumNova,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
];

const { state } = createStore<{
  modal?: ReturnType<typeof createWeb3Modal>;
  client?: PublicClient | WalletClient;
  diamond?: Diamond;
  chain?: Chain;
}>({});

export async function initialize(
  collectionId: string,
  isDev?: boolean
): Promise<void> {
  const data = await Diamond.getCollectionData(collectionId, isDev);
  if (!data) {
    throw new Error('Invalid collection.');
  }

  const metadata = {
    name: 'NiftyKit',
    description:
      'Sign Up for a NiftyKit account and create your first digital collectible in just minutes, instead of hours and days.',
    url: 'https://app.niftykit.com',
    icons: ['https://app.niftykit.com/logo-new.svg'],
  };

  const chains = availableChains.filter((chain) => chain.id === data.chainId);
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

  state.client = wagmiConfig.publicClient;
  state.modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeVariables: {
      '--w3m-font-family': 'Chivo, sans-serif',
      '--w3m-z-index': 99999,
    },
  });
  state.chain = chains[0];
  state.diamond = await Diamond.create(
    publicClientToProvider(
      wagmiConfig.webSocketPublicClient ?? wagmiConfig.publicClient
    ),
    collectionId,
    data,
    isDev
  );

  watchWalletClient(
    {
      chainId: data.chainId,
    },
    async (walletClient) => {
      state.diamond = await Diamond.create(
        walletClientToSigner(walletClient),
        collectionId,
        data,
        isDev
      );
      state.client = walletClient;
    }
  );
}

export default state;
