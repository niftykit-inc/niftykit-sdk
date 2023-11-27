import { Component, Host, h, State } from '@stencil/core';
import { watchBlockNumber } from '@wagmi/core';
import state from '../../stores/wallet';
import { ethers } from 'ethers';
import { convertERC20DecimalsToWei } from '../../utils/erc20';

@Component({
  tag: 'nk-drop-price-text',
  shadow: true,
})
export class NKDropPriceText {
  @State() price: string;

  disconnect: () => void;

  componentWillLoad() {
    this.disconnect = watchBlockNumber(
      { listen: true, chainId: state.chain?.id },
      async () => {
        if (state.diamond.apps.ape) {
          this.price = ethers.utils.formatEther(
            await state.diamond.apps.ape.apePrice()
          );
          return;
        }
        if (state.diamond.apps.erc20) {
          const erc20PriceInWei = await convertERC20DecimalsToWei(
            state.publicClient,
            (await state.diamond.apps.erc20.erc20ActiveCoin()) as `0x${string}`,
            BigInt(Number(await state.diamond.apps.erc20.erc20Price()))
          );
          this.price = ethers.utils.formatEther(erc20PriceInWei);
          return;
        }
        this.price = ethers.utils.formatEther(
          await state.diamond.apps.drop.price()
        );
      }
    );
  }

  disconnectedCallback() {
    this.disconnect();
  }

  render() {
    return (
      <Host>
        {this.price}
        <slot />
      </Host>
    );
  }
}
