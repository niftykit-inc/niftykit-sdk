import { createStore } from '@stencil/store';
import { configureChains, createClient } from '@wagmi/core';
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

const projectId = '03b23f1663190f4920cc1e182f163568';
const chains = [mainnet, polygon, arbitrum];

const { state } = createStore<{
  modal?: Web3Modal;
  client?: EthereumClient;
}>({});

export function initializeModal(chainId?: number): void {
  const { provider } = configureChains(
    chainId !== undefined
      ? chains.filter((chain) => chain.id === chainId)
      : chains,
    [w3mProvider({ projectId })]
  );
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ chains, version: 1, projectId }),
    provider,
  });

  state.client = new EthereumClient(wagmiClient, chains);
  state.modal = new Web3Modal(
    {
      projectId,
    },
    state.client
  );
}

// set initial modal
initializeModal();

export default state;
