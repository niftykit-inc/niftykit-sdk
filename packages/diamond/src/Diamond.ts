import { Provider } from '@ethersproject/providers';
import axios from 'axios';
import { ethers, Signer } from 'ethers';
import { API_ENDPOINT, API_ENDPOINT_DEV } from './config/endpoint';
import {
  CollectionApiResponse,
  MintLinkApiResponse,
  VerifyApiResponse,
  ErrorApiResponse,
} from './types';
import { BaseFacet } from './typechain-types/contracts/diamond';
import { BaseFacet__factory } from './typechain-types/factories/diamond';
import { DropFacet } from './typechain-types/contracts/apps/drop';
import { EditionFacet } from './typechain-types/contracts/apps/edition';
import { ApeDropFacet } from './typechain-types/contracts/apps/ape';
import { ERC20AppFacet } from './typechain-types/contracts/apps/erc20';
import { DropFacet__factory } from './typechain-types/factories/apps/drop';
import { EditionFacet__factory } from './typechain-types/factories/apps/edition';
import { ApeDropFacet__factory } from './typechain-types/factories/apps/ape';
import { ERC20AppFacet__factory } from './typechain-types/factories/apps/erc20';

export default class Diamond {
  signerOrProvider: Signer | Provider;
  collectionId: string;
  base?: BaseFacet;
  apps: {
    drop?: DropFacet;
    edition?: EditionFacet;
    ape?: ApeDropFacet;
    erc20?: ERC20AppFacet;
  };
  isDev?: boolean;
  chainId?: number;
  networkName?: string;
  data?: CollectionApiResponse;

  constructor(
    collectionId: string,
    signerOrProvider: Signer | Provider,
    isDev?: boolean
  ) {
    if (!collectionId) {
      throw new Error('No Collection ID.');
    }
    this.collectionId = collectionId;
    this.signerOrProvider = signerOrProvider;
    this.isDev = isDev;
    this.apps = {};
  }

  async init(): Promise<void> {
    const data = await Diamond.getCollectionData(this.collectionId, this.isDev);
    return this.initWithData(data);
  }

  initWithData(data: CollectionApiResponse): void {
    this.data = data;

    if (!this.data || !this.data.collectionId)
      throw new Error('Collection is not ready yet.');

    if (!this.data.address)
      throw new Error('Smart contract is not deployed yet.');

    this.chainId = this.data.chainId;
    this.networkName = this.data.networkName;
    this.base = BaseFacet__factory.connect(
      this.data.address,
      this.signerOrProvider
    );

    for (const app of this.data.apps) {
      if (app.id === ethers.utils.id('drop')) {
        this.apps.drop = DropFacet__factory.connect(
          this.data.address,
          this.signerOrProvider
        );
      }

      if (app.id === ethers.utils.id('edition')) {
        this.apps.edition = EditionFacet__factory.connect(
          this.data.address,
          this.signerOrProvider
        );
      }

      if (app.id === ethers.utils.id('ape')) {
        this.apps.ape = ApeDropFacet__factory.connect(
          this.data.address,
          this.signerOrProvider
        );
      }

      if (app.id === ethers.utils.id('erc20')) {
        this.apps.erc20 = ERC20AppFacet__factory.connect(
          this.data.address,
          this.signerOrProvider
        );
      }
    }
  }

  verify(wallet: string): Promise<VerifyApiResponse> {
    return Diamond.verifyWallet(this.collectionId, wallet, this.isDev);
  }

  verifyForEdition(
    wallet: string,
    editionId: number
  ): Promise<VerifyApiResponse> {
    return Diamond.verifyWalletForEdition(
      this.collectionId,
      wallet,
      editionId,
      this.isDev
    );
  }

  static async create(
    signerOrProvider: Signer | Provider,
    key: string,
    data?: CollectionApiResponse,
    isDev?: boolean
  ): Promise<Diamond | null> {
    const instance = new Diamond(key, signerOrProvider, isDev);
    if (data) {
      instance.initWithData(data);
    } else {
      await instance.init();
    }
    return instance;
  }

  static async verifyWallet(
    collectionId: string,
    wallet: string,
    isDev?: boolean
  ): Promise<VerifyApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/v3/collections/list/${collectionId}`;
    const resp = await axios.post<VerifyApiResponse & ErrorApiResponse>(
      url,
      {
        wallet,
      },
      {
        validateStatus: (status) => status < 500,
      }
    );

    if (resp.status >= 400) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    return resp.data;
  }

  static async verifyWalletForEdition(
    collectionId: string,
    wallet: string,
    editionId: number,
    isDev?: boolean
  ): Promise<VerifyApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/v3/editions/list/${collectionId}/${editionId}`;
    const resp = await axios.post<VerifyApiResponse & ErrorApiResponse>(
      url,
      {
        wallet,
      },
      {
        validateStatus: (status) => status < 500,
      }
    );

    if (resp.status >= 400) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    return resp.data;
  }

  static async getCollectionData(
    collectionId: string,
    isDev?: boolean
  ): Promise<CollectionApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/v3/collections/${collectionId}/address`;
    const resp = await axios.get<CollectionApiResponse & ErrorApiResponse>(
      url,
      {
        validateStatus: (status) => status < 500,
      }
    );

    if (resp.status >= 400) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    return resp.data;
  }

  static async getMintLinkByPublicKey(
    collectionId: string,
    publicKey: string,
    isDev?: boolean,
    unique?: boolean,
    quantity?: number
  ): Promise<MintLinkApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/onboarding/mintLinks/public/${publicKey}/${collectionId}?unique=${unique}&quantity=${quantity}`;
    const resp = await axios.get<MintLinkApiResponse & ErrorApiResponse>(url, {
      validateStatus: (status) => status < 500,
    });

    if (resp.status >= 400) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    return resp.data;
  }
}
