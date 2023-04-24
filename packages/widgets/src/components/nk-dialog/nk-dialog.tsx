import { MDCDialog } from '@material/dialog';
import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'nk-dialog',
  styleUrl: 'nk-dialog.scss',
  shadow: true,
})
export class NKDialog {
  container!: HTMLDivElement;

  dialog: MDCDialog;

  @Prop() dialogTitle = '';

  @Prop() open = false;

  @Prop() buttonText = 'Confirm';

  componentDidLoad() {
    this.dialog = new MDCDialog(this.container);

    if (this.open) {
      this.dialog.open();
    }
  }

  componentDidUpdate() {
    if (this.open) {
      this.dialog.open();
    }
  }

  render() {
    return (
      <div
        class="mdc-dialog"
        ref={(el) => (this.container = el as HTMLDivElement)}>
        <div class="mdc-dialog__container">
          <div
            class="mdc-dialog__surface"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="my-dialog-title"
            aria-describedby="my-dialog-content">
            {this.dialogTitle.length > 0 && (
              <h2 class="mdc-dialog__title" id="my-dialog-title">
                {this.dialogTitle}
              </h2>
            )}
            <div class="mdc-dialog__content" id="my-dialog-content">
              <slot />
            </div>
            <div class="mdc-dialog__actions">
              <button
                type="button"
                class="mdc-button mdc-dialog__button"
                data-mdc-dialog-action="discard">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">{this.buttonText}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
      </div>
    );
  }
}
