import { Component, Host, Method, Prop, State, h } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-mint-winter-button',
  styleUrl: 'nk-drop-mint-winter-button.scss',
  shadow: true,
})
export class NKDropMintWinterButton {
  /**
   * Winter Project Id
   */
  @Prop() projectId!: string;

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

  @State() saleActive: boolean;

  @State() presaleActive: boolean;

  @State() isOpen = false;

  @State() dialogOpen = false;

  @State() extraMintParams: Record<
    string,
    string | number | string[] | undefined
  > = null;

  button!: HTMLButtonElement;

  dialogTitle: string;

  dialogMessage: string;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        const [saleActive, presaleActive] = await Promise.all([
          state.diamond.apps.drop.saleActive(),
          state.diamond.apps.drop.presaleActive(),
        ]);
        this.saleActive = saleActive;
        this.presaleActive = presaleActive;
        this.loading = false;

        // sale not active then disable widget
        this.disabled = !(this.saleActive || this.presaleActive);
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

  private getProjectUrl(): string {
    let queryString = 'projectId=' + this.projectId;
    const address = state.walletClient?.account?.address;

    if (address) {
      queryString += '&walletAddress=' + address;
    }
    if (this.extraMintParams) {
      queryString += `&extraMintParams=${encodeURIComponent(
        JSON.stringify(this.extraMintParams)
      )}`;
    }

    const url = !state.diamond.isDev
      ? 'https://checkout.usewinter.com/?' + queryString
      : 'https://sandbox-winter-checkout.onrender.com/?' + queryString;

    return url;
  }

  private handleWindowEvent = (e) => {
    const { data } = e;
    if (data === 'closeWinterCheckoutModal') {
      this.isOpen = false;
      this.loading = false;
    } else if (data.name === 'successfulWinterCheckout') {
      this.isOpen = false;
      this.loading = false;

      this.dialogTitle = this.successTitle;
      this.dialogMessage = this.successMessage;
      this.dialogOpen = true;
    }
  };

  @Method()
  async openModal(): Promise<void> {
    this.loading = true;
    try {
      const address = state.walletClient?.account?.address;
      if (this.presaleActive) {
        const verify = await state.diamond.verify(address);
        this.extraMintParams = {
          ...verify,
        };
      }
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
    const Modal = () => {
      if (!this.isOpen) {
        return null;
      }

      return (
        <iframe
          id="winter-checkout"
          src={this.getProjectUrl()}
          style={{
            position: 'fixed',
            top: '0',
            bottom: '0',
            right: '0',
            width: '100%',
            border: 'none',
            margin: '0',
            padding: '0',
            overflow: 'hidden',
            zIndex: '999999',
            height: '100%',
          }}
        />
      );
    };

    return (
      <Host>
        <div part="wallet-btn-container" class="mdc-touch-target-wrapper">
          <button
            onClick={() => this.openModal()}
            part="winter-btn"
            disabled={this.loading || this.disabled}
            ref={(el) => (this.button = el as HTMLButtonElement)}
            class="mdc-button mdc-button--raised">
            <span class="mdc-button__ripple"></span>
            <span class="mdc-button__touch"></span>
            <span class="mdc-button__label">
              {this.loading ? <nk-loading /> : <slot />}
            </span>
          </button>
        </div>
        <Modal />
        <nk-dialog open={this.dialogOpen} dialogTitle={this.dialogTitle}>
          {this.dialogMessage}
        </nk-dialog>
      </Host>
    );
  }
}
