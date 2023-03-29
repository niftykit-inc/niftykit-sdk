import { Provider } from '@ethersproject/providers';
import axios from 'axios';
import { ethers, Signer } from 'ethers';
import { API_ENDPOINT, API_ENDPOINT_DEV } from './config/endpoint';
import { CollectionApiResponse, ErrorApiResponse } from './types';
import { BaseFacet } from './typechain-types/contracts/diamond';
import { BaseFacet__factory } from './typechain-types/factories/diamond';
import { DropFacet } from './typechain-types/contracts/apps/drop';
import { EditionFacet } from './typechain-types/contracts/apps/edition';
import { ApeDropFacet } from './typechain-types/contracts/apps/ape';
import { DropFacet__factory } from './typechain-types/factories/apps/drop';
import { EditionFacet__factory } from './typechain-types/factories/apps/edition';
import { ApeDropFacet__factory } from './typechain-types/factories/apps/ape';

export default class Diamond {
  signerOrProvider: Signer | Provider;
  collectionId: string;
  base?: BaseFacet;
  apps: {
    drop?: DropFacet;
    edition?: EditionFacet;
    ape?: ApeDropFacet;
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

  private async init(): Promise<void> {
    const data = await Diamond.getCollectionData(this.collectionId, this.isDev);
    return this.initWithData(data);
  }

  private async initWithData(data: CollectionApiResponse): Promise<void> {
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
    }
  }

  static async create(
    signerOrProvider: Signer | Provider,
    key: string,
    data?: CollectionApiResponse,
    isDev?: boolean
  ): Promise<Diamond | null> {
    const instance = new Diamond(key, signerOrProvider, isDev);
    if (data) {
      await instance.initWithData(data);
    } else {
      await instance.init();
    }
    return instance;
  }

  static async getCollectionData(
    collectionId: string,
    isDev?: boolean
  ): Promise<CollectionApiResponse & ErrorApiResponse> {
    const baseUrl = isDev ? API_ENDPOINT_DEV : API_ENDPOINT;
    const url = `${baseUrl}/v3/collections/${collectionId}/address`;
    const resp = await axios.get<CollectionApiResponse & ErrorApiResponse>(
      url,
      {
        validateStatus: (status) => status < 500,
      }
    );

    if (resp.status === 401) {
      const { message } = resp.data as ErrorApiResponse;
      throw new Error(message);
    }

    if (resp.status !== 200) {
      throw new Error('Something went wrong.');
    }

    return resp.data;
  }
}
