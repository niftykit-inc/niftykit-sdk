import { Provider } from '@ethersproject/providers';
import { TokenCollection, TokenCollection__factory } from '@niftykit/contracts/typechain';
import { Signer } from 'ethers';

export default class Redeemable {
  contract: TokenCollection = {} as TokenCollection;

  private async init(
    signerOrProvider: Signer | Provider,
    contractAddress: string
  ): Promise<void> {
    this.contract = TokenCollection__factory.connect(
      contractAddress,
      signerOrProvider
    )
    if (!this.contract) {
      throw new Error('Initialization failed.');
    }
  }

  static async create(
    signerOrProvider: Signer | Provider,
    contractAddress: string
  ): Promise<Redeemable | null> {
    const instance = new Redeemable();
    await instance.init(signerOrProvider, contractAddress);
    return instance;
  }
}
