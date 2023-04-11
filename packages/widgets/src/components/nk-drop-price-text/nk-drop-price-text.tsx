import { Component, Host, h, State } from '@stencil/core';
import state from '../../stores/wallet';
import { watchBlockNumber } from '@wagmi/core';

@Component({
  tag: 'nk-drop-price-text',
  shadow: true,
})
export class NKDropPriceText {
  @State() price: number;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      this.price = (await state.diamond.apps.drop.price()).toNumber();
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return (
      <Host>
        {this.price}
        <slot />
      </Host>
    );
  }
}
