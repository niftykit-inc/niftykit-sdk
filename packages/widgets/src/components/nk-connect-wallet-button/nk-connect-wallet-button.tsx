import { Component, h, State } from '@stencil/core';
import { MDCRipple } from '@material/ripple';
import { getEnsName, watchChainId, watchClient } from '@wagmi/core';
import state from '../../stores/wallet';
import truncateEthAddress from '../../utils/wallet';

@Component({
  tag: 'nk-connect-wallet-button',
  styleUrl: 'nk-connect-wallet-button.scss',
  shadow: true,
})
export class NKConnectWalletButton {
  @State() isConnected: boolean = false;

  @State() isWrongNetwork: boolean = false;

  @State() address: string = '';

  @State() ensName: string | null = '';

  button!: HTMLButtonElement;

  ripple: MDCRipple | null = null;

  disconnect: () => void = () => {};

  componentWillLoad() {
    const unwatchAccount = watchClient(state.config, {
      onChange: async (client) => {
        if (client.account) {
          const chainId = client.chain?.id;
          this.isConnected = true;
          this.address = client.account.address;
          this.isWrongNetwork = chainId !== state.chain?.id;
          this.ensName = await getEnsName(state.config, {
            address: client.account.address,
          });
        } else {
          this.isConnected = false;
          this.isWrongNetwork = false;
          this.address = '';
          this.ensName = '';
        }
      },
    });

    const unwatchNetwork = watchChainId(state.config, {
      onChange: (chainId) => {
        if (this.isConnected) {
          this.isWrongNetwork = chainId !== state.chain?.id;
        }
      },
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
            state.modal?.open({
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
