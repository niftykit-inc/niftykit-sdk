import { Component, Host, h, State } from '@stencil/core';
import { watchAccount } from '@wagmi/core';

@Component({
  tag: 'nk-is-not-connected',
  shadow: true,
})
export class NKIsNotConnected {
  @State() isNotConnected?: boolean = true;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchAccount((account) => {
      this.isNotConnected = !account.isConnected;
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return <Host>{this.isNotConnected ? <slot /> : null}</Host>;
  }
}
