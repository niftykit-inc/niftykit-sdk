import { Component, Host, h, State, Prop } from '@stencil/core';
import { watchBlockNumber, getAccount } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-is-holder',
  shadow: true,
})
export class NKIsHolder {
  @State() isHolder = false;

  /**
   * Holding a specific Token ID
   */
  @Prop() tokenId?: string;

  disconnect: () => void = () => {};

  componentWillLoad() {
    this.disconnect = watchBlockNumber(state.config, {
      chainId: state.chain?.id,
      onBlockNumber: async () => {
        const account = getAccount(state.config);

        if (this.tokenId) {
          this.isHolder =
            (await state?.diamond?.base?.ownerOf(this.tokenId)) ===
            account.address;
        } else {
          this.isHolder =
            Number(
              await state?.diamond?.base?.balanceOf(account?.address || '')
            ) > 0;
        }
      },
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return <Host>{this.isHolder ? <slot /> : null}</Host>;
  }
}
