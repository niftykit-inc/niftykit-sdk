import { Component, Host, h, State } from '@stencil/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-supply-text',
  styleUrl: 'nk-drop-supply-text.scss',
  shadow: true,
})
export class NKDropSupplyText {
  @State() supply: number;

  @State() maxAmount: number;

  async componentWillLoad() {
    this.supply = (await state.diamond.base.totalSupply()).toNumber();
    this.maxAmount = (await state.diamond.apps.drop.maxAmount()).toNumber();
  }

  render() {
    return (
      <Host>
        <p>
          {this.supply} / {this.maxAmount}
        </p>
        <slot />
      </Host>
    );
  }
}
