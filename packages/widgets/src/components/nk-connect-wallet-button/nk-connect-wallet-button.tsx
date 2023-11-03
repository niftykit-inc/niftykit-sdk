import { Component, h, State } from '@stencil/core';
import { MDCRipple } from '@material/ripple';
import { fetchEnsName, watchAccount, watchNetwork } from '@wagmi/core';
import state from '../../stores/wallet';
import truncateEthAddress from '../../utils/wallet';

@Component({
  tag: 'nk-connect-wallet-button',
  styleUrl: 'nk-connect-wallet-button.scss',
  shadow: true,
})
export class NKConnectWalletButton {
  @State() isConnected: boolean;

  @State() isWrongNetwork: boolean;

  @State() address: string;

  @State() ensName: string;

  button!: HTMLButtonElement;

  ripple: MDCRipple | null = null;

  disconnect: () => void;

  componentWillLoad() {
    const unwatchAccount = watchAccount(async (account) => {
      if (account.isConnected) {
        const chainId = await account.connector.getChainId();
        this.isConnected = true;
        this.address = account.address;
        this.isWrongNetwork = chainId !== state.chain?.id;
        this.ensName = await fetchEnsName({ address: account.address });
      } else {
        this.isConnected = false;
        this.isWrongNetwork = false;
        this.address = '';
        this.ensName = '';
      }
    });

    const unwatchNetwork = watchNetwork(async (network) => {
      if (this.isConnected) {
        this.isWrongNetwork = network.chain?.id !== state.chain?.id;
      }
    });

    this.disconnect = () => {
      unwatchAccount();
      unwatchNetwork();
    };
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
          onClick={() =>
            state.modal.open({
              view: this.isWrongNetwork
                ? 'Networks'
                : this.isConnected
                ? 'Account'
                : 'Connect',
            })
          }
          ref={(el) => (this.button = el as HTMLButtonElement)}
          class="mdc-button mdc-button--raised">
          <span class="mdc-button__ripple" />
          <span class="mdc-button__touch" />
          <span class="mdc-button__label">
            {this.isConnected ? (
              !this.isWrongNetwork ? (
                this.ensName ? (
                  this.ensName
                ) : (
                  truncateEthAddress(this.address)
                )
              ) : (
                'Wrong Network'
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
