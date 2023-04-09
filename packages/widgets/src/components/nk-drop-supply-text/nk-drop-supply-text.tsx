import { Component, Host, h, State } from '@stencil/core';
import state from '../../stores/wallet';
import { watchBlockNumber } from '@wagmi/core';

@Component({
  tag: 'nk-drop-supply-text',
  shadow: true,
})
export class NKDropSupplyText {
  @State() supply: number;

  @State() maxAmount: number;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      this.supply = (await state.diamond.base.totalSupply()).toNumber();
      this.maxAmount = (await state.diamond.apps.drop.maxAmount()).toNumber();
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return (
      <Host>
        {this.supply} / {this.maxAmount}
        <slot />
      </Host>
    );
  }
}
