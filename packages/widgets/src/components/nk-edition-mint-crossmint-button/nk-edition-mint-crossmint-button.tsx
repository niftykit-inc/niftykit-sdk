import { Component, Host, Method, Prop, State, h } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import { ethers } from 'ethers';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-edition-mint-crossmint-button',
  styleUrl: 'nk-edition-mint-crossmint-button.scss',
  shadow: true,
})
export class NKEditionMintCrossmintButton {
  /**
   * Crossmint Project Id
   */
  @Prop() projectId!: string;

  /**
   * Crossmint Collection Id
   */
  @Prop() collectionId!: string;

  /**
   * Edition Id
   */
  @Prop() editionId!: number;

  @State() mintSuccess = false;

  @State() isMinting = false;

  /**
   * Title on the success modal
   */
  @Prop() successTitle = 'Success';

  /**
   * Body message on the success modal
   */
  @Prop() successMessage = 'Successfully minted an NFT';

  /**
   * Link text on the success modal
   */
  @Prop() successLinkText? = 'here';

  /**
   * Link on the success modal
   */
  @Prop() successLink? = '';

  @State() disabled = true;

  @State() loading = true;

  @State() mintTo: string = null;

  @State() active: boolean;

  @State() isOpen = false;

  @State() dialogOpen = false;

  @State() mintConfig: Record<string, string | number | string[] | undefined> =
    {
      type: 'erc-721',
      quantity: '1',
      totalPrice: '0',
      editionId: this.editionId.toString(),
      proof: [],
    };

  crossmintButton!: HTMLElement;

  dialogTitle: string;

  dialogMessage: string;

  disconnect: () => void;

  componentDidLoad() {
    this.crossmintUpdate();
  }

  componentDidUpdate() {
    this.crossmintUpdate();
  }

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        const address = state.walletClient?.account?.address;
        const [edition, price] = await Promise.all([
          state.diamond.apps.edition.getEdition(this.editionId),
          state.diamond.apps.edition.getEditionPrice(this.editionId),
        ]);
        let proof: string[] = [];
        if (address) {
          const verify = await state.diamond.verifyForEdition(
            address,
            this.editionId
          );
          proof = verify?.proof ?? [];
        }
        this.mintTo = address;
        this.active = edition.active;
        this.mintConfig = {
          ...this.mintConfig,
          totalPrice: ethers.utils.formatEther(price),
          proof,
        };
        this.loading = this.isMinting;

        // sale not active then disable widget
        this.disabled = !this.active;
      }
    );

    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleWindowEvent);
    }
  }

  disconnectedCallback() {
    this.disconnect();

    if (typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleWindowEvent);
    }
  }

  private crossmintUpdate() {
    this.crossmintButton.setAttribute(
      'mintConfig',
      JSON.stringify(this.mintConfig, null, 2)
    );
    const shadowRoot = this.crossmintButton.shadowRoot;
    if (shadowRoot) {
      const img = shadowRoot.querySelector('img');
      if (img) {
        img.style.display = 'none';
      }
    }
  }

  private handleWindowEvent = (e: { data: { type: string } }) => {
    const {
      data: { type },
    } = e;

    const loadingEvents = [
      'payment:preparation.succeeded',
      'payment:process.started',
    ];
    const successEvents = ['payment:process.succeeded'];
    const failedEvents = [
      'payment:rejected',
      'payment:preparation.failed',
      'quote:status.invalidated',
    ];

    if (loadingEvents.includes(type)) {
      this.loading = true;
      this.isMinting = true;
      this.mintSuccess = false;
      this.isMinting = false;
      this.mintSuccess = true;
    }

    if (successEvents.includes(type)) {
      this.dialogTitle = this.successTitle;
      this.dialogMessage = this.successMessage;
      this.dialogOpen = true;
      this.loading = false;
    }

    if (failedEvents.includes(type)) {
      this.dialogTitle = 'Error';
      this.dialogMessage = 'Payment failed';
      this.dialogOpen = true;
      this.loading = false;
      this.isMinting = false;
      this.mintSuccess = false;
    }
  };

  @Method()
  async openModal(): Promise<void> {
    this.loading = true;
    try {
      this.isOpen = true;
    } catch (e) {
      this.loading = false;
      this.isOpen = false;

      this.dialogTitle = 'Error';
      this.dialogMessage = e.message;
      this.dialogOpen = true;
    }
  }

  render() {
    return (
      <Host>
        <script src="https://unpkg.com/@crossmint/client-sdk-vanilla-ui@1.0.1-alpha.4/lib/index.global.js"></script>
        <div part="crossmint-btn-container" class="mdc-touch-target-wrapper">
          <crossmint-pay-button
            exportparts="button, contentParagraph"
            ref={(el: HTMLElement) => (this.crossmintButton = el)}
            class="crossmint-btn"
            disabled={this.loading || this.disabled}
            projectId={this.projectId}
            collectionId={this.collectionId}
            mintTo={this.mintTo}
          />
        </div>
        <nk-dialog open={this.dialogOpen} dialogTitle={this.dialogTitle}>
          {this.dialogMessage}
          {this.mintSuccess && !!this.successLink && (
            <span>
              {' '}
              <a
                href={this.successLink}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'rgba(0,0,0,0.6)' }}>
                {this.successLinkText}
              </a>
            </span>
          )}
        </nk-dialog>
      </Host>
    );
  }
}
