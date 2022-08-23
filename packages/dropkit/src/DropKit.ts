import { Provider } from '@ethersproject/providers';
import { DropCollection, DropCollection__factory } from '@niftykit/contracts';

import axios from 'axios';
import { BigNumber, ContractReceipt, Signer } from 'ethers';
import { API_ENDPOINT, API_ENDPOINT_DEV } from './config/endpoint';
import {
  DropApiResponse,
  ErrorApiResponse,
  ProofApiResponse,
} from './types/api-responses';

export default class DropKit {
  contract: DropCollection = {} as DropCollection;
  signerOrProvider: Signer | Provider;
  dropCollectionId: string;
  isDev?: boolean;

  private get apiBaseUrl(): string {
    return this.isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
  }

  constructor(
    key: string,
    signerOrProvider: Signer | Provider,
    isDev?: boolean
  ) {
    if (!key) {
      throw new Error('No SDK key.');
    }
    this.dropCollectionId = key;
    this.signerOrProvider = signerOrProvider;
    this.isDev = isDev;
  }

  private async init(): Promise<void> {
    const data = await DropKit.getCollectionData(
      this.dropCollectionId,
      this.isDev
    );

    if (!data || !data.collectionId) {
      throw new Error('Drop Collection is not ready yet.');
    }
    if (!data.address) {
      throw new Error('Smart contract is not deployed yet.');
    }
    this.contract = DropCollection__factory.connect(
      data.address,
      this.signerOrProvider
    );
    if (!this.contract) {
      throw new Error('Initialization failed.');
    }
  }

  static async create(
    signerOrProvider: Signer | Provider,
    key: string,
    isDev?: boolean
  ): Promise<DropKit | null> {
    const instance = new DropKit(key, signerOrProvider, isDev);
    await instance.init();
    return instance;
  }

  static async getCollectionData(
    key: string,
    isDev?: boolean
  ): Promise<DropApiResponse & ErrorApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/drops/${key}/address`;
    const resp = await axios.get<DropApiResponse & ErrorApiResponse>(url, {
      validateStatus: (status) => status < 500,
    });

    if (resp.status === 401) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    if (resp.status !== 200) {
      throw new Error('Something went wrong.');
    }

    return resp.data;
  }

  async price(): Promise<BigNumber> {
    return this.contract.price();
  }

  async maxAmount(): Promise<BigNumber> {
    return this.contract.maxAmount();
  }

  async maxPerMint(): Promise<BigNumber> {
    return this.contract.maxPerMint();
  }

  async maxPerWallet(): Promise<BigNumber> {
    return this.contract.maxPerWallet();
  }

  async totalSupply(): Promise<BigNumber> {
    return this.contract.totalSupply();
  }

  async saleActive(): Promise<boolean> {
    return this.contract.saleActive();
  }

  async presaleActive(): Promise<boolean> {
    return this.contract.presaleActive();
  }

  async generateProof(
    address: string
  ): Promise<ProofApiResponse & ErrorApiResponse> {
    const { data } = await axios.post<ProofApiResponse & ErrorApiResponse>(
      `${this.apiBaseUrl}/v2/drops/list/${this.dropCollectionId}`,
      {
        wallet: address,
      },
      {
        validateStatus: (status) => status < 500,
      }
    );

    return data;
  }

  async mint(quantity: number): Promise<ContractReceipt | null> {
    const presaleActive = await this.presaleActive();
    const saleActive = await this.saleActive();

    if (!saleActive && !presaleActive) {
      throw new Error('Collection is not active.');
    }

    const price = await this.price();
    const amount = price.mul(quantity);

    // Presale mint
    if (presaleActive) {
      return await this._presaleMint(quantity, amount);
    }

    // Public sale mint
    return await this._mint(quantity, amount);
  }

  private async _mint(
    quantity: number,
    amount: BigNumber
  ): Promise<ContractReceipt> {
    const gasLimit = await this.contract.estimateGas.mint(quantity, {
      value: amount,
    });
    const safeGasLimit = Math.floor(gasLimit.toNumber() * 1.2);
    const trx = await this.contract.mint(quantity, {
      value: amount,
      gasLimit: safeGasLimit,
    });

    return trx.wait();
  }

  private async _presaleMint(
    quantity: number,
    amount: BigNumber
  ): Promise<ContractReceipt> {
    const signer = this.signerOrProvider as Signer;
    const address = await signer.getAddress();
    const data = await this.generateProof(address);
    if (data.message) {
      throw new Error(data.message);
    }

    const gasLimit = await this.contract.estimateGas.presaleMint(
      quantity,
      data.allowed,
      data.proof,
      {
        value: amount,
      }
    );
    const safeGasLimit = Math.floor(gasLimit.toNumber() * 1.2);
    const trx = await this.contract.presaleMint(
      quantity,
      data.allowed,
      data.proof,
      {
        value: amount,
        gasLimit: safeGasLimit,
      }
    );

    return trx.wait();
  }
}
