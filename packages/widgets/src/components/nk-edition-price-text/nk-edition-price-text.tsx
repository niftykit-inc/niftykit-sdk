import { Component, Host, h, State, Prop } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';
import { ethers } from 'ethers';

@Component({
  tag: 'nk-edition-price-text',
  shadow: true,
})
export class NKEditionPriceText {
  @State() price: string;

  /**
   * Edition ID
   */
  @Prop() editionId!: number;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        this.price = ethers.utils.formatEther(
          await state.diamond.apps.edition.getEditionPrice(this.editionId)
        );
      }
    );
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
