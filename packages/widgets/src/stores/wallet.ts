import Diamond from '@niftykit/diamond';
import { createStore } from '@stencil/store';
import { Env } from '@stencil/core';
import { configureChains, createConfig, watchWalletClient } from '@wagmi/core';
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumNova,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
} from '@wagmi/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import {
  publicClientToProvider,
  walletClientToSigner,
} from '../utils/adapters';
import { Chain } from 'viem';

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
  modal?: Web3Modal;
  client?: EthereumClient;
  diamond?: Diamond;
  chain?: Chain;
}>({});

export async function initialize(
  collectionId: string,
  isDev?: boolean
): Promise<void> {
  const data = await Diamond.getCollectionData(collectionId, isDev);
  if (!data) throw new Error('Invalid collection.');

  const chains = availableChains.filter((chain) => chain.id === data.chainId);
  const { publicClient, webSocketPublicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
  ]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
    webSocketPublicClient,
  });

  state.client = new EthereumClient(wagmiConfig, chains);
  state.modal = new Web3Modal(
    {
      projectId,
      themeVariables: {
        '--w3m-font-family': 'Chivo, sans-serif',
        '--w3m-background-color': '#000',
        '--w3m-background-border-radius': '16px',
        '--w3m-container-border-radius': '16px',
        '--w3m-z-index': '99999',
      },
    },
    state.client
  );
  state.chain = chains[0];
  state.modal.setDefaultChain(state.chain);
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
    }
  );
}

export default state;
