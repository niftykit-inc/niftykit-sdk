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

  /**
   * Title on the success modal
   */
  @Prop() successTitle = 'Success';

  /**
   * Body message on the success modal
   */
  @Prop() successMessage = 'Successfully minted an NFT';

  container!: HTMLDivElement;

  select: MDCSelect | null = null;

  selectedText: HTMLSpanElement;

  dialogTitle: string;

  dialogMessage: string;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      const [
        supply,
        maxAmount,
        maxPerMint,
        price,
        mintFee,
        saleActive,
        presaleActive,
      ] = await Promise.all([
        state.diamond.base.totalSupply(),
        state.diamond.apps.drop.maxAmount(),
        state.diamond.apps.drop.maxPerMint(),
        state.diamond.apps.drop.price(),
        state.diamond.apps.drop.mintFee(),
        state.diamond.apps.drop.saleActive(),
        state.diamond.apps.drop.presaleActive(),
      ]);

      // common values
      this.supply = supply.toNumber();
      this.maxAmount = maxAmount.toNumber();
      this.maxPerMint = maxPerMint.toNumber();
      this.mintFee = mintFee;
      this.price = price;
      this.saleActive = saleActive;
      this.presaleActive = presaleActive;
      this.selections = Array(this.maxPerMint).fill('');

      if (state.diamond.apps.erc20) {
        const [erc20Price, erc20MintFee, erc20SaleActive, erc20PresaleActive] =
          await Promise.all([
            state.diamond.apps.erc20.erc20Price(),
            state.diamond.apps.erc20.erc20MintFee(),
            state.diamond.apps.erc20.erc20SaleActive(),
            state.diamond.apps.erc20.erc20PresaleActive(),
          ]);

        this.erc20Price = BigInt(Number(erc20Price));
        this.mintFee = erc20MintFee;
        this.saleActive = erc20SaleActive;
        this.presaleActive = erc20PresaleActive;
      } else if (state.diamond.apps.ape) {
        const [apePrice, apeMintFee, apeSaleActive, apePresaleActive] =
          await Promise.all([
            state.diamond.apps.ape.apePrice(),
            state.diamond.apps.ape.apeMintFee(),
            state.diamond.apps.ape.apeSaleActive(),
            state.diamond.apps.ape.apePresaleActive(),
          ]);

        this.erc20Price = BigInt(Number(apePrice));
        this.mintFee = apeMintFee;
        this.saleActive = apeSaleActive;
        this.presaleActive = apePresaleActive;
      }

      this.loading = false;
      // sale not active then disable widget
      this.disabled = !(this.saleActive || this.presaleActive);
    });
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

        if (state.diamond.apps.ape) {
          const erc20Contract = state.isDev
            ? GOERLI_APE_COIN_ADDRESS
            : MAINNET_APE_COIN_ADDRESS;

          await this.ensureERC20Allowance(
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
          this.dialogOpen = true;

          return;
        }

        if (state.diamond.apps.erc20) {
          const erc20Contract =
            (await state.diamond.apps.erc20.erc20ActiveCoin()) as `0x${string}`;

          await this.ensureERC20Allowance(
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
        this.dialogOpen = true;

        return;
      }

      if (this.saleActive) {
        if (state.diamond.apps.ape) {
          const erc20Contract = state.isDev
            ? GOERLI_APE_COIN_ADDRESS
            : MAINNET_APE_COIN_ADDRESS;

          await this.ensureERC20Allowance(
            erc20Contract,
            state.diamond.apps.ape.address as `0x${string}`
          );

          const tx = await state.diamond.apps.ape.apeMintTo(address, quantity, {
            value: this.mintFee.mul(quantity),
          });

          await tx.wait();

          this.dialogTitle = this.successTitle;
          this.dialogMessage = this.successMessage;
          this.dialogOpen = true;

          return;
        }

        if (state.diamond.apps.erc20) {
          const erc20Contract =
            (await state.diamond.apps.erc20.erc20ActiveCoin()) as `0x${string}`;

          await this.ensureERC20Allowance(
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
          this.dialogOpen = true;

          return;
        }

        const tx = await state.diamond.apps.drop.mintTo(address, quantity, {
          value: this.price.mul(quantity),
        });

        await tx.wait();

        this.dialogTitle = this.successTitle;
        this.dialogMessage = this.successMessage;
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
    }
  }

  private async ensureERC20Allowance(
    erc20Contract: `0x${string}`,
    spenderAddress: `0x${string}`
  ) {
    const userAddress = state.walletClient?.account?.address;
    if (!userAddress) {
      throw new Error('Wallet not connected');
    }
    // check user balance first before getting allowance.
    const balance = await getBalance(
      state.publicClient,
      erc20Contract,
      userAddress
    );

    if (balance < this.erc20Price) {
      throw new Error('Insufficient balance.');
    }

    // check for allowance
    const currentAllowance = await getAllowance(
      state.publicClient,
      erc20Contract,
      userAddress,
      spenderAddress
    );

    if (currentAllowance < this.erc20Price) {
      await increaseAllowance(
        state.publicClient,
        state.walletClient,
        erc20Contract,
        spenderAddress as `0x${string}`,
        this.erc20Price
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
            {this.selections.map((_, value) => (
              <li
                class={this.optionClasses(value + 1)}
                aria-selected={value + 1 === this.selectedValue}
                data-value={value + 1}
                role="option">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">{value + 1}</span>
              </li>
            ))}
          </ul>
        </div>
        <nk-dialog open={this.dialogOpen} dialogTitle={this.dialogTitle}>
          {this.dialogMessage}
        </nk-dialog>
      </div>
    );
  }
}
