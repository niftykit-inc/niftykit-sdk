import { MDCSelect } from '@material/select';
import { Component, Method, Prop, State, h } from '@stencil/core';
import { getChainId, watchBlockNumber } from '@wagmi/core';
import { BigNumber } from 'ethers';
import state from '../../stores/wallet';
import { handleError } from '../../utils/errors';

@Component({
  tag: 'nk-edition-mint-button',
  styleUrl: 'nk-edition-mint-button.scss',
  shadow: true,
})
export class NKEditionMintButton {
  @State() disabled = true;

  @State() loading = true;

  @State() quantity: number = 0;

  @State() maxQuantity: number = 0;

  @State() maxPerWallet: number = 0;

  @State() maxPerMint: number = 0;

  @State() price: BigNumber = BigNumber.from(0);

  @State() active: boolean = false;

  @State() selections: number[] = [];

  @State() dialogOpen = false;

  @State() selectedValue = -1;

  /**
   * Edition ID
   */
  @Prop() editionId!: number;

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

  selectedText: HTMLSpanElement = new HTMLSpanElement();

  dialogTitle: string = '';

  dialogMessage: string = '';

  disconnect: () => void = () => {};

  componentWillLoad() {
    this.disconnect = watchBlockNumber(state.config, {
      chainId: state.chain?.id,
      onBlockNumber: async () => {
        const [edition, price] = await Promise.all([
          state?.diamond?.apps?.edition?.getEdition(this.editionId),
          state?.diamond?.apps?.edition?.getEditionPrice(this.editionId),
        ]);

        if (!edition) {
          return;
        }

        const { quantity, maxQuantity, maxPerWallet, maxPerMint, active } =
          edition;

        this.quantity = quantity.toNumber();
        this.maxQuantity = maxQuantity.toNumber();
        this.maxPerWallet = maxPerWallet.toNumber();
        this.maxPerMint = maxPerMint.toNumber();
        this.price = price ?? BigNumber.from(0);
        this.active = active;
        this.selections = Array.from(
          { length: this.maxPerMint },
          (_, i) => i + 1
        );
        this.loading = false;

        // sale not active then disable widget
        this.disabled = !this.active;
      },
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
        this.selectedValue = Number(this?.select?.value ?? -1);
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
      const address = state.walletClient?.account?.address ?? '';
      const chainId = getChainId(state.config);
      if (chainId !== state.chain?.id) {
        state?.modal?.open({
          view: 'Networks',
        });
        return;
      }

      if (this.active) {
        const verify = await state?.diamond?.verifyForEdition(
          address,
          this.editionId
        );

        const tx = await state?.diamond?.apps?.edition?.mintEdition(
          address,
          this.editionId,
          quantity,
          verify?.proof ?? [],
          {
            value: this.price.mul(quantity),
          }
        );

        await tx?.wait();

        this.dialogTitle = this.successTitle;
        this.dialogMessage = this.successMessage;
        this.dialogOpen = true;

        return;
      }

      throw new Error('Sale is not active.');
    } catch (err) {
      console.log(err);
      this.dialogTitle = 'Error';
      this.dialogMessage = handleError(err as never);
      this.dialogOpen = true;
    } finally {
      this.loading = false;
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
        </nk-dialog>
      </div>
    );
  }
}
