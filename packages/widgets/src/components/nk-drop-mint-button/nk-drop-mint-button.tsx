import { Component, Host, h, Method } from '@stencil/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-mint-button',
  styleUrl: 'nk-drop-mint-button.scss',
  shadow: true,
})
export class NKDropMintButton {
  @Method()
  async mint() {
    try {
      await state.diamond.apps.drop.mintTo(
        state.client.getAccount().address,
        1
      );
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <Host>
        <button onClick={this.mint}>Mint</button>
        <slot />
      </Host>
    );
  }
}
