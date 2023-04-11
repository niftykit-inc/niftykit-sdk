import { Component, h, Method, State, Prop } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import { MDCSelect } from '@material/select';
import Swal from 'sweetalert2';
import { handleError } from '../../utils/errors';
import state from '../../stores/wallet';
import { BigNumber } from 'ethers';

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

  @State() saleActive: boolean;

  @State() presaleActive: boolean;

  @State() selections: number[] = [];

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

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      this.supply = (await state.diamond.base.totalSupply()).toNumber();
      this.maxAmount = (await state.diamond.apps.drop.maxAmount()).toNumber();
      this.maxPerMint = (await state.diamond.apps.drop.maxPerMint()).toNumber();
      this.price = await state.diamond.apps.drop.price();
      this.saleActive = await state.diamond.apps.drop.saleActive();
      this.presaleActive = await state.diamond.apps.drop.presaleActive();
      this.selections = Array(this.maxPerMint).fill('');
      this.loading = false;

      // if sale is active, enable the widget
      if (this.saleActive || this.presaleActive) {
        this.disabled = false;
      }
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
      const { address } = state.client.getAccount();
      if (this.presaleActive) {
        const verify = await state.diamond.verify(address);

        // calculate fees
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

        await Swal.fire({
          title: this.successTitle,
          text: this.successMessage,
          willOpen: () => {
            this.loading = false;
          },
        });

        return;
      }

      if (this.saleActive) {
        const tx = await state.diamond.apps.drop.mintTo(address, quantity, {
          value: this.price.mul(quantity),
        });

        await tx.wait();

        await Swal.fire({
          title: this.successTitle,
          text: this.successMessage,
          willOpen: () => {
            this.loading = false;
          },
        });

        return;
      }

      throw new Error('Sale is not active.');
    } catch (err) {
      console.log(err);
      await Swal.fire({
        title: 'Error',
        text: handleError(err),
      });
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
      </div>
    );
  }
}
