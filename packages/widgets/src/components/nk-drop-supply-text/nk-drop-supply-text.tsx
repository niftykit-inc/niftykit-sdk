import { Component, Host, h, State } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-supply-text',
  shadow: true,
})
export class NKDropSupplyText {
  @State() supply: number;

  @State() maxAmount: number;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        const [supply, maxAmount] = await Promise.all([
          state.diamond.base.totalSupply(),
          state.diamond.apps.drop.maxAmount(),
        ]);
        this.supply = Number(supply);
        this.maxAmount = Number(maxAmount);
      }
    );
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return (
      <Host>
        {this.maxAmount === 0
          ? this.supply
          : `${this.supply} / ${this.maxAmount}`}
        <slot />
      </Host>
    );
  }
}
