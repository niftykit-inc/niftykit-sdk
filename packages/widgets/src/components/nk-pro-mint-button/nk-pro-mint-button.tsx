import { Component, h, Prop, State } from '@stencil/core';
import { initialize } from '../../stores/onboarding';
import { PRO_MINTLINK_DEV, PRO_MINTLINK } from '../../constants/links';

@Component({
  tag: 'nk-pro-mint-button',
  styleUrl: 'nk-pro-mint-button.scss',
  shadow: true,
})
export class NKProMintButton {
  /**
   * Collection ID
   */
  @Prop() collectionId!: string;

  /**
   * Public Key
   */
  @Prop() publicKey!: string;

  @Prop() isDev?: boolean;

  @State() mintLinkId: string = null;

  container!: HTMLDivElement;

  button!: HTMLButtonElement;

  async componentWillLoad() {
    const data = await initialize(
      this.collectionId,
      this.publicKey,
      this.isDev
    );

    this.mintLinkId = data.id;
  }

  render() {
    return (
      <div part="mint-btn-container">
        <a
          part="mint-btn"
          href={
            this.isDev
              ? `${PRO_MINTLINK_DEV}${this.mintLinkId}`
              : `${PRO_MINTLINK}${this.mintLinkId}`
          }
          target="_blank"
          rel="noreferrer"
          class="mdc-button mdc-button--raised">
          <span class="mdc-button__ripple" />
          <span class="mdc-button__touch" />
          <span class="mdc-button__label">
            <slot />
          </span>
        </a>
      </div>
    );
  }
}
