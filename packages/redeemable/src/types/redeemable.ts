import { ethers } from 'ethers';

export interface RedeemableData {
  index: number;
  tokenURI: string;
  price: ethers.BigNumber;
  maxAmount: number;
  maxPerWallet: number;
  maxPerMint: number;
  redeemedCount: number;
  merkleRoot: string;
  active: boolean;
  nonce: ethers.BigNumber;
}
