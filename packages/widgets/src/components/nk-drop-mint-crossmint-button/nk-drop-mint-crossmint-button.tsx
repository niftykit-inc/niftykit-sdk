import { Component, h, Method, State, Prop, Host } from '@stencil/core';
import { ethers } from 'ethers';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-mint-crossmint-button',
  styleUrl: 'nk-drop-mint-crossmint-button.scss',
  shadow: true,
})
export class NKDropMintCrossmintButton {
  /**
   * Crossmint Project Id
   */
  @Prop() projectId!: string;

  /**
   * Crossmint Collection Id
   */
  @Prop() collectionId!: string;

  /**
   * Title on the success modal
   */
  @Prop() successTitle = 'Success';

  /**
   * Body message on the success modal
   */
  @Prop() successMessage = 'Successfully minted an NFT';

  @State() disabled = true;

  @State() loading = true;

  @State() mintTo: string = null;

  @State() saleActive: boolean;

  @State() presaleActive: boolean;

  @State() isOpen = false;

  @State() dialogOpen = false;

  @State() mintConfig: Record<string, string | number | string[] | undefined> =
    {
      type: 'erc-721',
      quantity: '1',
      totalPrice: '0',
    };

  crossmintButton!: HTMLElement;

  dialogTitle: string;

  dialogMessage: string;

  disconnect: () => void;

  componentDidLoad() {
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

  componentDidUpdate() {
    this.crossmintButton.setAttribute(
      'mintConfig',
      JSON.stringify(this.mintConfig, null, 2)
    );
  }

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      const { address } = state.client.getAccount();
      const [saleActive, presaleActive, price] = await Promise.all([
        state.diamond.apps.drop.saleActive(),
        state.diamond.apps.drop.presaleActive(),
        state.diamond.apps.drop.price(),
      ]);
      this.mintTo = address;
      this.saleActive = saleActive;
      this.presaleActive = presaleActive;
      this.mintConfig = {
        ...this.mintConfig,
        totalPrice: ethers.utils.formatEther(price),
      };
      this.loading = false;

      // sale not active then disable widget
      this.disabled = !(this.saleActive || this.presaleActive);
    });

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
        <div part="wallet-btn-container" class="mdc-touch-target-wrapper">
          <crossmint-pay-button
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
        </nk-dialog>
      </Host>
    );
  }
}
