import { Component, Host, h, State } from '@stencil/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-connect-wallet-button',
  styleUrl: 'nk-connect-wallet-button.scss',
  shadow: true,
})
export class NKConnectWalletButton {
  @State() isConnected: boolean;

  @State() address: string;

  componentWillLoad() {
    state.client.watchAccount((account) => {
      this.isConnected = account.isConnected;
      this.address = account.address;
    });
  }

  render() {
    return (
      <Host>
        <button onClick={() => state.modal.openModal()}>
          {this.isConnected ? this.address : 'Connect Wallet'}
        </button>
      </Host>
    );
  }
}
