import { Component, Host, h, State, Method } from '@stencil/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-mint-button',
  styleUrl: 'nk-drop-mint-button.scss',
  shadow: true,
})
export class NKDropMintButton {
  @Method()
  async mint() {
    // state.diamond.apps.drop;
  }

  render() {
    return (
      <Host>
        <button onClick={this.mint}>Mint</button>
      </Host>
    );
  }
}
