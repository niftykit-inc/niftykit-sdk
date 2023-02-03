import { Provider } from '@ethersproject/providers';
import axios from 'axios';
import { BigNumber, Contract, ContractReceipt, Signer } from 'ethers';
import DropKitCollectionV2ABI from './abis/DropKitCollectionV2.json';
import DropKitCollectionV3ABI from './abis/DropKitCollectionV3.json';
import DropKitCollectionV4ABI from './abis/DropKitCollectionV4.json';
import DropKitCollectionV5ABI from './abis/DropKitCollectionV5.json';
import DropKitCollectionV6ABI from './abis/DropKitCollectionV6.json';
import DropKitCollectionV7ABI from './abis/DropKitCollectionV7.json';
import { API_ENDPOINT, API_ENDPOINT_DEV } from './config/endpoint';
import {
  DropApiResponse,
  ErrorApiResponse,
  ProofApiResponseLegacy,
  ProofApiResponse,
} from './types/api-responses';

const abis: Record<number, any> = {
  2: DropKitCollectionV2ABI,
  3: DropKitCollectionV3ABI,
  4: DropKitCollectionV4ABI,
  5: DropKitCollectionV5ABI,
  6: DropKitCollectionV6ABI,
  7: DropKitCollectionV7ABI,
};

export default class DropKit {
  contract: Contract = {} as Contract;
  signerOrProvider: Signer | Provider;
  dropCollectionId: string;
  isDev?: boolean;
  chainId?: number;
  networkName?: string;
  version = 0;
  // only for v3 and older
  maxSupply?: number;

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
    this.chainId = data.chainId;
    this.networkName = data.networkName;
    this.version = data.version || 2;
    this.maxSupply = this.version <= 3 ? data.maxAmount : undefined;
    const abi = abis[this.version];

    this.contract = new Contract(data.address, abi, this.signerOrProvider);
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

  price(): Promise<BigNumber> {
    return this.version <= 3 ? this.contract._price() : this.contract.price();
  }

  async maxAmount(): Promise<BigNumber> {
    if (this.version <= 3) {
      return BigNumber.from(this.maxSupply || 0);
    }
    return await this.contract.maxAmount();
  }

  maxPerMint(): Promise<BigNumber> {
    return this.version <= 3
      ? this.contract._maxPerMint()
      : this.contract.maxPerMint();
  }

  maxPerWallet(): Promise<BigNumber> {
    return this.version <= 3
      ? this.contract._maxPerWallet()
      : this.contract.maxPerWallet();
  }

  totalSupply(): Promise<BigNumber> {
    return this.contract.totalSupply();
  }

  saleActive(): Promise<boolean> {
    return this.version <= 3
      ? this.contract.started()
      : this.contract.saleActive();
  }

  async presaleActive(): Promise<boolean> {
    // First version of the contract ABI does not have presale
    if (this.version < 3) {
      return false;
    }

    // presaleActive() method is not available in the v3 contracts
    // So we need to assume that the presale is active and check with generateProof()
    if (this.version === 3) {
      return !(await this.saleActive());
    }

    return await this.contract.presaleActive();
  }

  async generateProofLegacy(
    wallet: string
  ): Promise<ProofApiResponseLegacy & ErrorApiResponse> {
    const { data } = await axios.post<
      ProofApiResponseLegacy & ErrorApiResponse
    >(
      `${this.apiBaseUrl}/drops/list/${this.dropCollectionId}`,
      {
        wallet,
      },
      {
        validateStatus: (status) => status < 500,
      }
    );

    return data;
  }

  async generateProof(
    wallet: string
  ): Promise<ProofApiResponse & ErrorApiResponse> {
    const { data } = await axios.post<ProofApiResponse & ErrorApiResponse>(
      `${this.apiBaseUrl}/v2/drops/list/${this.dropCollectionId}`,
      {
        wallet,
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
      // Backwards compatibility with v3 contracts:
      // If the public sale is not active, we can still try mint with the presale
      return this.version <= 4
        ? this._presaleMintLegacy(quantity, amount)
        : this._presaleMint(quantity, amount);
    }

    // Public sale mint
    return this._mint(quantity, amount);
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

  private async _presaleMintLegacy(
    quantity: number,
    amount: BigNumber
  ): Promise<ContractReceipt> {
    const signer = this.signerOrProvider as Signer;
    const address = await signer.getAddress();
    const data = await this.generateProofLegacy(address);
    if (data.message) {
      // Backwards compatibility for v3 contracts
      if (this.version === 3) {
        throw new Error(
          'Collection is not active or your wallet is not part of presale.'
        );
      }
      throw new Error(data.message);
    }

    const gasLimit = await this.contract.estimateGas.presaleMint(
      quantity,
      data.proof,
      {
        value: amount,
      }
    );

    const safeGasLimit = Math.floor(gasLimit.toNumber() * 1.2);

    const trx = await this.contract.presaleMint(quantity, data.proof, {
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
