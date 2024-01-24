import { Component, Host, h, State, Prop } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-edition-supply-text',
  shadow: true,
})
export class NKEditionSupplyText {
  @State() quantity: number = 0;

  @State() maxQuantity: number = 0;

  /**
   * Edition ID
   */
  @Prop() editionId!: number;

  disconnect: () => void = () => {};

  componentWillLoad() {
    this.disconnect = watchBlockNumber(state.config, {
      chainId: state.chain?.id,
      onBlockNumber: async () => {
        const edition = await state?.diamond?.apps?.edition?.getEdition(
          this.editionId
        );

        this.quantity = Number(edition?.quantity ?? 0);
        this.maxQuantity = Number(edition?.maxQuantity ?? 0);
      },
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
