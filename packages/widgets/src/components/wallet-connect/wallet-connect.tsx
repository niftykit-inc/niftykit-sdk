import { configureChains, createClient } from '@wagmi/core';
import { arbitrum, mainnet, polygon } from '@wagmi/core/chains';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';
import { Component, Host, h } from '@stencil/core';

const projectId = '03b23f1663190f4920cc1e182f163568';
const chains = [mainnet, polygon, arbitrum];

@Component({
  tag: 'wallet-connect',
  styleUrl: 'wallet-connect.scss',
  shadow: true,
})
export class WalletConnect {
  modal: Web3Modal;
  ethereumClient: EthereumClient;

  componentWillLoad() {
    const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
    const wagmiClient = createClient({
      autoConnect: true,
      connectors: w3mConnectors({ chains, version: 1, projectId }),
      provider,
    });

    this.ethereumClient = new EthereumClient(wagmiClient, chains);

    this.modal = new Web3Modal(
      {
        projectId,
      },
      this.ethereumClient
    );
  }

  componentDidLoad() {
    this.modal.openModal();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
