export type ProofApiResponseLegacy = {
  proof: string[];
};

export type ProofApiResponse = ProofApiResponseLegacy & {
  allowed: number;
};

export type DropApiResponse = {
  address: string;
  collectionId: string;
  version: number;
  chainId: number;
  networkName: string;
  maxAmount?: number;
};

export type ErrorApiResponse = {
  message: string;
};
