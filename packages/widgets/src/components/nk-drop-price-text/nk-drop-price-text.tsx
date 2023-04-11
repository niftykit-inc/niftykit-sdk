import { Component, Host, h, State } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';
import { ethers } from 'ethers';

@Component({
  tag: 'nk-drop-price-text',
  shadow: true,
})
export class NKDropPriceText {
  @State() price: string;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      this.price = ethers.utils.formatEther(
        await state.diamond.apps.drop.price()
      );
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
