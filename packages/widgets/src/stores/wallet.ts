import Diamond from '@niftykit/diamond';
import { createStore } from '@stencil/store';
import { Env } from '@stencil/core';
import { configureChains, createClient, watchSigner } from '@wagmi/core';
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
} from '@wagmi/core/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

const projectId = Env.projectId;
const availableChains = [
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
];

const { state } = createStore<{
  modal?: Web3Modal;
  client?: EthereumClient;
  diamond?: Diamond;
}>({});

export async function initialize(
  collectionId: string,
  isDev?: boolean
): Promise<void> {
  const data = await Diamond.getCollectionData(collectionId, isDev);
  if (!data) throw new Error('Invalid collection.');

  const chains = availableChains.filter((chain) => chain.id === data.chainId);
  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ chains, version: 1, projectId }),
    provider,
  });

  state.client = new EthereumClient(wagmiClient, chains);
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
  state.diamond = await Diamond.create(
    wagmiClient.provider,
    collectionId,
    data,
    isDev
  );

  watchSigner(
    {
      chainId: data.chainId,
    },
    async (provider) => {
      state.diamond = await Diamond.create(provider, collectionId, data, isDev);
    }
  );
}

export default state;
