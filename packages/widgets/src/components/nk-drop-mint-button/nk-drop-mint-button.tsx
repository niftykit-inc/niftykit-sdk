import { Component, h, Method, State, Prop } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import { MDCSelect } from '@material/select';
import { BigNumber } from 'ethers';
import { handleError } from '../../utils/errors';
import state from '../../stores/wallet';
import {
  GOERLI_APE_COIN_ADDRESS,
  MAINNET_APE_COIN_ADDRESS,
  getAllowance,
  getBalance,
  increaseAllowance,
} from '../../utils/erc20';

@Component({
  tag: 'nk-drop-mint-button',
  styleUrl: 'nk-drop-mint-button.scss',
  shadow: true,
})
export class NKDropMintButton {
  @State() disabled = true;

  @State() loading = true;

  @State() supply: number;

  @State() maxAmount: number;

  @State() maxPerMint: number;

  @State() price: BigNumber;

  @State() mintFee: BigNumber;

  @State() erc20Price: bigint;

  @State() saleActive: boolean;

  @State() presaleActive: boolean;

  @State() selections: number[] = [];

  @State() dialogOpen = false;

  @State() selectedValue = -1;

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

  container!: HTMLDivElement;

  select: MDCSelect | null = null;

  selectedText: HTMLSpanElement;

  dialogTitle: string;

  dialogMessage: string;

  dialogSuccessLinkText: string;

  dialogSuccessLink: string;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        const [
          supplyValue,
          maxAmountValue,
          maxPerMintValue,
          priceValue,
          saleActiveValue,
          presaleActiveValue,
        ] = await Promise.all([
          state.diamond.base.totalSupply(),
          state.diamond.apps.drop.maxAmount(),
          state.diamond.apps.drop.maxPerMint(),
          state.diamond.apps.drop.price(),
          state.diamond.apps.drop.saleActive(),
          state.diamond.apps.drop.presaleActive(),
        ]);

        let erc20Price = BigInt(0);
        let mintFee = BigNumber.from(0);
        let erc20SaleActive = false;
        let erc20PresaleActive = false;

        if (state.diamond.apps.erc20) {
          const [
            erc20PriceValue,
            erc20MintFeeValue,
            erc20SaleActiveValue,
            erc20PresaleActiveValue,
          ] = await Promise.all([
            state.diamond.apps.erc20.erc20Price(),
            state.diamond.apps.erc20.erc20MintFee(),
            state.diamond.apps.erc20.erc20SaleActive(),
            state.diamond.apps.erc20.erc20PresaleActive(),
          ]);

          erc20Price = BigInt(Number(erc20PriceValue));
          mintFee = erc20MintFeeValue;
          erc20SaleActive = erc20SaleActiveValue;
          erc20PresaleActive = erc20PresaleActiveValue;
        } else if (state.diamond.apps.ape) {
          const [
            apePriceValue,
            apeMintFeeValue,
            apeSaleActiveValue,
            apePresaleActiveValue,
          ] = await Promise.all([
            state.diamond.apps.ape.apePrice(),
            state.diamond.apps.ape.apeMintFee(),
            state.diamond.apps.ape.apeSaleActive(),
            state.diamond.apps.ape.apePresaleActive(),
          ]);

          erc20Price = BigInt(Number(apePriceValue));
          mintFee = apeMintFeeValue;
          erc20SaleActive = apeSaleActiveValue;
          erc20PresaleActive = apePresaleActiveValue;
        }

        this.erc20Price = erc20Price;
        this.mintFee = mintFee;
        this.supply = Number(supplyValue);
        this.maxAmount = Number(maxAmountValue);
        this.maxPerMint = Number(maxPerMintValue);
        this.price = priceValue;
        this.saleActive = saleActiveValue || erc20SaleActive;
        this.presaleActive = presaleActiveValue || erc20PresaleActive;
        this.selections = Array.from(
          { length: this.maxPerMint },
          (_, i) => i + 1
        );
        this.loading = this.isMinting;
        // sale not active then disable widget
        this.disabled = !(this.saleActive || this.presaleActive);
      }
    );
  }

  componentDidLoad() {
    this.setSelectedText();
  }

  componentDidUpdate() {
    if (this.selections.length > 0 && !this.select) {
      this.select = new MDCSelect(this.container);
      this.select.listen('MDCSelect:change', () => {
        // trigger mint
        this.selectedValue = Number(this.select.value);
        this.mint(this.selectedValue);
      });
    }

    this.setSelectedText();
  }

  disconnectedCallback() {
    this.disconnect();
  }

  @Method()
  async mint(quantity: number) {
    try {
      this.loading = true;
      this.mintSuccess = false;
      this.isMinting = true;
      const address = state.walletClient?.account?.address;
      const chainId = await state.walletClient?.getChainId();
      if (chainId !== state.chain?.id) {
        state.modal.open({
          view: 'Networks',
        });
        return;
      }
      if (this.presaleActive) {
        const verify = await state.diamond.verify(address);

        const apePresaleActive =
          await state.diamond.apps.ape?.apePresaleActive();
        const erc20PresaleActive =
          await state.diamond.apps.erc20?.erc20PresaleActive();

        if (state.diamond.apps.ape && apePresaleActive) {
          const erc20Contract = state.isDev
            ? GOERLI_APE_COIN_ADDRESS
            : MAINNET_APE_COIN_ADDRESS;

          await this.ensureERC20Allowance(
            quantity,
            erc20Contract,
            state.diamond.apps.ape.address as `0x${string}`
          );

          const tx = await state.diamond.apps.ape.apePresaleMintTo(
            address,
            quantity,
            verify.allowed,
            verify.proof,
            {
              value: this.mintFee.mul(quantity),
            }
          );

          await tx.wait();

          this.dialogTitle = this.successTitle;
          this.dialogMessage = this.successMessage;
          this.mintSuccess = true;
          this.dialogOpen = true;

          return;
        }

        if (state.diamond.apps.erc20 && erc20PresaleActive) {
          const erc20Contract =
            (await state.diamond.apps.erc20.erc20ActiveCoin()) as `0x${string}`;

          await this.ensureERC20Allowance(
            quantity,
            erc20Contract,
            state.diamond.apps.erc20.address as `0x${string}`
          );

          const tx = await state.diamond.apps.erc20.erc20PresaleMintTo(
            address,
            quantity,
            verify.allowed,
            verify.proof,
            {
              value: this.mintFee.mul(quantity),
            }
          );

          await tx.wait();

          this.dialogTitle = this.successTitle;
          this.dialogMessage = this.successMessage;
          this.mintSuccess = true;
          this.dialogOpen = true;

          return;
        }

        const tx = await state.diamond.apps.drop.presaleMintTo(
          address,
          quantity,
          verify.allowed,
          verify.proof,
          {
            value: this.price.mul(quantity),
          }
        );

        await tx.wait();

        this.dialogTitle = this.successTitle;
        this.dialogMessage = this.successMessage;
        this.mintSuccess = true;
        this.dialogOpen = true;

        return;
      }

      if (this.saleActive) {
        const apeSaleActive = await state.diamond.apps.ape?.apeSaleActive();
        const erc20SaleActive =
          await state.diamond.apps.erc20?.erc20SaleActive();

        if (state.diamond.apps.ape && apeSaleActive) {
          const erc20Contract = state.isDev
            ? GOERLI_APE_COIN_ADDRESS
            : MAINNET_APE_COIN_ADDRESS;

          await this.ensureERC20Allowance(
            quantity,
            erc20Contract,
            state.diamond.apps.ape.address as `0x${string}`
          );

          const tx = await state.diamond.apps.ape.apeMintTo(address, quantity, {
            value: this.mintFee.mul(quantity),
          });

          await tx.wait();

          this.dialogTitle = this.successTitle;
          this.dialogMessage = this.successMessage;
          this.mintSuccess = true;
          this.dialogOpen = true;

          return;
        }

        if (state.diamond.apps.erc20 && erc20SaleActive) {
          const erc20Contract =
            (await state.diamond.apps.erc20.erc20ActiveCoin()) as `0x${string}`;

          await this.ensureERC20Allowance(
            quantity,
            erc20Contract,
            state.diamond.apps.erc20.address as `0x${string}`
          );

          const tx = await state.diamond.apps.erc20.erc20MintTo(
            address,
            quantity,
            {
              value: this.mintFee.mul(quantity),
            }
          );

          await tx.wait();

          this.dialogTitle = this.successTitle;
          this.dialogMessage = this.successMessage;
          this.mintSuccess = true;
          this.dialogOpen = true;

          return;
        }

        const tx = await state.diamond.apps.drop.mintTo(address, quantity, {
          value: this.price.mul(quantity),
        });

        await tx.wait();

        this.dialogTitle = this.successTitle;
        this.dialogMessage = this.successMessage;
        this.mintSuccess = true;
        this.dialogOpen = true;

        return;
      }

      throw new Error('Sale is not active.');
    } catch (err) {
      console.log(err);
      this.dialogTitle = 'Error';
      this.dialogMessage = handleError(err);
      this.dialogOpen = true;
    } finally {
      this.loading = false;
      this.isMinting = false;
    }
  }

  private async ensureERC20Allowance(
    quantity: number,
    erc20Contract: `0x${string}`,
    spenderAddress: `0x${string}`
  ) {
    const userAddress = state.walletClient?.account?.address;
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }
    const price = this.erc20Price * BigInt(quantity);
    // check user balance first before getting allowance.
    const balance = await getBalance(
      state.publicClient,
      erc20Contract,
      userAddress
    );

    if (balance < price) {
      throw new Error('Insufficient balance.');
    }

    // check for allowance
    const currentAllowance = await getAllowance(
      state.publicClient,
      erc20Contract,
      userAddress,
      spenderAddress
    );

    if (currentAllowance < price) {
      await increaseAllowance(
        state.publicClient,
        state.walletClient,
        erc20Contract,
        spenderAddress as `0x${string}`,
        price
      );
    }
  }

  private setSelectedText(): void {
    setTimeout(() => {
      const result =
        this.selectedValue < 0 ? '<slot />' : this.selectedValue.toString();
      this.selectedText.innerHTML = this.loading ? '<nk-loading />' : result;
    }, 10);
  }

  private optionClasses(value: number): string {
    return `mdc-deprecated-list-item ${
      this.selectedValue === value ? 'mdc-deprecated-list-item--selected' : ''
    }`;
  }

  render() {
    return (
      <div
        part="mint-btn-container"
        class={`mdc-select mdc-select--filled mdc-select--no-label ${
          this.disabled ? 'mdc-select--disabled' : ''
        }`}
        ref={(el) => (this.container = el as HTMLDivElement)}>
        <div
          part="mint-btn"
          class="mdc-select__anchor"
          role="button"
          aria-haspopup="listbox"
          aria-expanded="false"
          aria-labelledby="mint-selected-text">
          <span class="mdc-select__ripple"></span>
          <span class="mdc-select__selected-text-container">
            <span
              part="mint-text"
              id="mint-selected-text"
              class="mdc-select__selected-text"
              ref={(el) => (this.selectedText = el as HTMLSpanElement)}></span>
          </span>
          <span part="mint-dropdown-icon" class="mdc-select__dropdown-icon">
            <svg
              class="mdc-select__dropdown-icon-graphic"
              viewBox="7 10 10 5"
              focusable="false">
              <polygon
                class="mdc-select__dropdown-icon-inactive"
                stroke="none"
                fill-rule="evenodd"
                points="7 10 12 15 17 10"></polygon>
              <polygon
                class="mdc-select__dropdown-icon-active"
                stroke="none"
                fill-rule="evenodd"
                points="7 15 12 10 17 15"></polygon>
            </svg>
          </span>
        </div>
        <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
          <ul
            class="mdc-deprecated-list"
            role="listbox"
            aria-label="Quantity Picker listbox">
            {this.selections.map((value) => (
              <li
                class={this.optionClasses(value)}
                aria-selected={value === this.selectedValue}
                data-value={value}
                role="option">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">{value}</span>
              </li>
            ))}
          </ul>
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
      </div>
    );
  }
}
