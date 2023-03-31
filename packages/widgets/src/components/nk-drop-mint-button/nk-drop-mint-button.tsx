import { Component, h, Method, State } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';

@Component({
  tag: 'nk-drop-mint-button',
  styleUrl: 'nk-drop-mint-button.scss',
  shadow: true,
})
export class NKDropMintButton {
  @State() disabled = true;

  @State() supply: number;

  @State() maxAmount: number;

  @State() saleActive: boolean;

  @State() presaleActive: boolean;

  container!: HTMLDivElement;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber({ listen: true }, async () => {
      this.supply = (await state.diamond.base.totalSupply()).toNumber();
      this.maxAmount = (await state.diamond.apps.drop.maxAmount()).toNumber();
      this.saleActive = await state.diamond.apps.drop.saleActive();
      this.presaleActive = await state.diamond.apps.drop.presaleActive();
    });
  }

  disconnectedCallback() {
    this.disconnect();
  }

  @Method()
  async mint() {
    try {
      await state.diamond.apps.drop.mintTo(
        state.client.getAccount().address,
        1
      );
    } catch (err) {
      console.log(err);
    }
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
              class="mdc-select__selected-text"></span>
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
            {/* {this.values.map((value) => (
              <li
                class={this.optionClasses(value)}
                aria-selected={value === this.selectedValue}
                data-value={value}
                role="option">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">{value}</span>
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    );
  }
}
