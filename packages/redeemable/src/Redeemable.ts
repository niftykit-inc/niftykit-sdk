import { Provider } from '@ethersproject/providers';
import {
  TokenCollection,
  TokenCollection__factory,
} from '@niftykit/contracts/typechain';
import { ContractTransaction, ethers, Signer } from 'ethers';
import { RedeemableData } from '../types/redeemable';

export default class Redeemable {
  contract: TokenCollection = {} as TokenCollection;

  private async init(
    signerOrProvider: Signer | Provider,
    contractAddress: string
  ): Promise<void> {
    if (!ethers.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address.');
    }
    this.contract = TokenCollection__factory.connect(
      contractAddress,
      signerOrProvider
    );
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

  async getRedeemable(tokenId: number): Promise<RedeemableData> {
    const payload = await this.contract.redeemableByIndex(tokenId);
    return {
      index: tokenId,
      tokenURI: payload.uri,
      price: payload.price,
      maxAmount: payload.maxAmount.toNumber(),
      maxPerWallet: payload.maxPerWallet.toNumber(),
      maxPerMint: payload.maxPerMint.toNumber(),
      redeemedCount: payload.redeemedCount.toNumber(),
      merkleRoot: payload.merkleRoot,
      active: payload.active,
      nonce: payload.nonce,
    };
  }

  async redeem(
    tokenId: number,
    quantity: number,
    signature: string
  ): Promise<ContractTransaction> {
    const nft = await this.getRedeemable(tokenId);
    return await this.contract['redeem(uint256,uint256,bytes)'](
      nft.index,
      quantity,
      signature,
      {
        value: nft.price.mul(quantity),
      }
    );
  }

  async presaleRedeem(
    tokenId: number,
    quantity: number,
    signature: string,
    proof: string[]
  ): Promise<ContractTransaction> {
    const nft = await this.getRedeemable(tokenId);
    return await this.contract['redeem(uint256,uint256,bytes,bytes32[])'](
      nft.index,
      quantity,
      signature,
      proof,
      {
        value: nft.price.mul(quantity),
      }
    );
  }

  async burn(tokenId: number): Promise<ContractTransaction> {
    return await this.contract.burn(tokenId);
  }
}
