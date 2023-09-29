import { Component, Host, h, State, Prop } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-edition-supply-text',
  shadow: true,
})
export class NKEditionSupplyText {
  @State() quantity: number;

  @State() maxQuantity: number;

  /**
   * Edition ID
   */
  @Prop() editionId!: number;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      const edition = await state.diamond.apps.edition.getEdition(
        this.editionId
      );

      this.quantity = edition.quantity.toNumber();
      this.maxQuantity = edition.maxQuantity.toNumber();
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return (
      <Host>
        {this.maxQuantity === 0
          ? this.quantity
          : `${this.quantity} / ${this.maxQuantity}`}
        <slot />
      </Host>
    );
  }
}
