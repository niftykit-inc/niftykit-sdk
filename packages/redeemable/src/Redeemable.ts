import { Provider } from '@ethersproject/providers';
import {
  TokenCollection,
  TokenCollectionV2,
  TokenCollection__factoryV2,
  TokenCollection__factory,
} from '@niftykit/contracts';

import axios from 'axios';
import { ContractTransaction, ethers, Signer } from 'ethers';
import { API_ENDPOINT, API_ENDPOINT_DEV } from './config/endpoint';
import { RedeemableApiResponse } from './types/api-responses';
import { RedeemableData } from './types/redeemable';

export default class Redeemable {
  contract: TokenCollection | TokenCollectionV2 = {} as
    | TokenCollection
    | TokenCollectionV2;
  isDev?: boolean;
  version = 1;

  private get apiBaseUrl(): string {
    return this.isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
  }

  constructor(isDev?: boolean) {
    this.isDev = isDev;
  }

  private async init(
    signerOrProvider: Signer | Provider,
    contractAddress: string
  ): Promise<void> {
    if (!ethers.utils.isAddress(contractAddress)) {
      throw new Error('Invalid contract address.');
    }
    const url = `${this.apiBaseUrl}/v2/redeemables/${contractAddress}`;
    const resp = await axios.get<RedeemableApiResponse>(url, {
      validateStatus: (status) => status < 500,
    });

    if (resp.status !== 200) {
      throw new Error('Something went wrong.');
    }

    this.version = resp.data.version;

    this.contract =
      this.version === 1
        ? TokenCollection__factory.connect(contractAddress, signerOrProvider)
        : TokenCollection__factoryV2.connect(contractAddress, signerOrProvider);

    if (!this.contract) {
      throw new Error('Initialization failed.');
    }
  }

  static async create(
    signerOrProvider: Signer | Provider,
    contractAddress: string,
    isDev?: boolean
  ): Promise<Redeemable | null> {
    const instance = new Redeemable(isDev);
    await instance.init(signerOrProvider, contractAddress);
    return instance;
  }

  async getRedeemable(tokenId: number): Promise<RedeemableData> {
    const payload =
      this.version === 1
        ? await (this.contract as TokenCollection).redeemableByIndex(tokenId)
        : await (this.contract as TokenCollectionV2).redeemableAt(tokenId);

    return {
      index: tokenId,
      tokenURI: payload[0],
      price: payload.price,
      maxAmount: payload[3].toNumber(),
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
