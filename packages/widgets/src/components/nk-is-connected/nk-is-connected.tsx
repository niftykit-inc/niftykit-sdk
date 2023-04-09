import { Component, Host, h, State } from '@stencil/core';
import { watchAccount } from '@wagmi/core';

@Component({
  tag: 'nk-is-connected',
  shadow: true,
})
export class NKIsConnected {
  @State() isConnected?: boolean = false;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchAccount((account) => {
      this.isConnected = account.isConnected;
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return <Host>{this.isConnected ? <slot /> : null}</Host>;
  }
}
