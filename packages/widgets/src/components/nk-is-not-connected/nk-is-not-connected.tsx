import { Component, Host, h, State } from '@stencil/core';
import { watchAccount } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-is-not-connected',
  shadow: true,
})
export class NKIsNotConnected {
  @State() isNotConnected?: boolean = true;

  disconnect: () => void = () => {};

  componentWillLoad() {
    this.disconnect = watchAccount(state.config, {
      onChange: (account) => {
        this.isNotConnected = !account.isConnected;
      },
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return <Host>{this.isNotConnected ? <slot /> : null}</Host>;
  }
}
