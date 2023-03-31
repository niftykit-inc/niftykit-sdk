import { Component, h, State } from '@stencil/core';
import { MDCRipple } from '@material/ripple';
import { fetchEnsName, watchAccount } from '@wagmi/core';
import state from '../../stores/wallet';
import truncateEthAddress from '../../utils/wallet';

@Component({
  tag: 'nk-connect-wallet-button',
  styleUrl: 'nk-connect-wallet-button.scss',
  shadow: true,
})
export class NKConnectWalletButton {
  @State() isConnected: boolean;

  @State() address: string;

  @State() ensName: string;

  button!: HTMLButtonElement;

  ripple: MDCRipple | null = null;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchAccount(async (account) => {
      this.isConnected = account.isConnected;
      this.address = account.address;
      if (account.isConnected) {
        this.ensName = await fetchEnsName({ address: account.address });
      }
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  componentDidLoad() {
    this.ripple = new MDCRipple(this.button);
  }

  render() {
    return (
      <div part="wallet-btn-container" class="mdc-touch-target-wrapper">
        <button
          part="wallet-btn"
          onClick={() => state.modal.openModal()}
          ref={(el) => (this.button = el as HTMLButtonElement)}
          class="mdc-button mdc-button--raised">
          <span class="mdc-button__ripple" />
          <span class="mdc-button__touch" />
          <span class="mdc-button__label">
            {this.isConnected ? (
              this.ensName ? (
                this.ensName
              ) : (
                truncateEthAddress(this.address)
              )
            ) : (
              <slot />
            )}
          </span>
        </button>
      </div>
    );
  }
}
