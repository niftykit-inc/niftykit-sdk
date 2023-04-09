export type App = {
  id: string;
  name: string;
  type: string;
  version: number;
};

export type CollectionApiResponse = {
  address: string;
  collectionId: string;
  version: number;
  chainId: number;
  networkName: string;
  apps: App[];
};

export type VerifyApiResponse = {
  proof: string[];
  allowed: number;
};

export type ErrorApiResponse = {
  message: string;
};
