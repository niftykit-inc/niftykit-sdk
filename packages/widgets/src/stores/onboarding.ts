import Diamond from '@niftykit/diamond';
import { createStore } from '@stencil/store';

type MintLinkApiResponse = {
  id: string;
  collectionId: string;
  public: string;
};

const { state } = createStore<{
  isDev?: boolean;
}>({});

export async function initialize(
  collectionId: string,
  publicKey: string,
  isDev?: boolean,
  unique?: boolean,
  quantity?: number
): Promise<MintLinkApiResponse> {
  const data = await Diamond.getMintLinkByPublicKey(
    collectionId,
    publicKey,
    isDev,
    unique,
    quantity
  );

  if (!data) {
    throw new Error('Invalid public mint link.');
  }

  return data;
}

export default state;
