import { Component, Host, h, Prop } from '@stencil/core';
import state, { initialize } from '../../stores/wallet';

@Component({
  tag: 'nk-diamond',
  styleUrl: 'nk-diamond.scss',
  shadow: true,
})
export class NKDiamond {
  /**
   * Collection ID
   */
  @Prop() collectionId!: string;

  async componentWillLoad() {
    await initialize(this.collectionId);
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
