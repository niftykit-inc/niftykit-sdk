import { Component, Host, h, State } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-supply-text',
  shadow: true,
})
export class NKDropSupplyText {
  @State() supply: number = 0;

  @State() maxAmount: number = 0;

  disconnect: () => void = () => {};

  componentWillLoad() {
    this.disconnect = watchBlockNumber(state.config, {
      chainId: state.chain?.id,
      onBlockNumber: async () => {
        const [supply, maxAmount] = await Promise.all([
          state?.diamond?.base?.totalSupply(),
          state?.diamond?.apps?.drop?.maxAmount(),
        ]);
        this.supply = Number(supply ?? 0);
        this.maxAmount = Number(maxAmount ?? 0);
      },
    });
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
