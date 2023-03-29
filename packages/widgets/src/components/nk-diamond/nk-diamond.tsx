import { Component, Host, h, Prop, State } from '@stencil/core';
import { initialize } from '../../stores/wallet';

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

  @Prop() isDev?: boolean;

  @State() loading?: boolean = true;

  async componentWillLoad() {
    await initialize(this.collectionId, this.isDev);
    this.loading = false;
  }

  render() {
    return <Host>{!this.loading ? <slot /> : null}</Host>;
  }
}
