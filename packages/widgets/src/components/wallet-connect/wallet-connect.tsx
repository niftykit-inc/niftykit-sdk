import { Component, Host, h } from '@stencil/core';
import state, { initializeModal } from '../../stores/wallet';

@Component({
  tag: 'wallet-connect',
  styleUrl: 'wallet-connect.scss',
  shadow: true,
})
export class WalletConnect {
  componentWillLoad() {
    initializeModal();
  }

  componentDidLoad() {
    state.modal.openModal();
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
