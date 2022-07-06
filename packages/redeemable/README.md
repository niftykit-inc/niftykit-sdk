# Redeemable SDK

NiftyKit Redeemable SDK Library.

## Installation

Install via npm or yarn

```bash
# with npm
npm install @niftykit/redeemable

# with yarn
yarn add @niftykit/redeemable
```

Or use it via CDN

```html
<script async src='https://unpkg.com/@niftykit/redeemable/dist/umd/index.js'></script>
```

## How to use

Ensure you have your redeemable `tokenId` and your `signature`. Once you generate your redeemable link from NiiftyKit, you can get these values from your URL.

Example URL:

```bash
https://app.niftykit.com/collections/your-collection/redeemables/1/0x5f635ae4051272d477a6ebbcdfd32d2d55a300004512c01873315194d853f15b29087799de88530240a0a0f17f5e9f8d6881b4b248ebc83c06ce7c33b9ef01971b
```

In this case the `tokenId` is `1` and the signature is

```bash
0x5f635ae4051272d477a6ebbcdfd32d2d55a300004512c01873315194d853f15b29087799de88530240a0a0f17f5e9f8d6881b4b248ebc83c06ce7c33b9ef01971b
```

> Note: if you re-generate your redeemable link, you will get a new `signature` and need to update your code.

```typescript
// using ethers.js
import { ethers } from 'ethers';
import Redeemable from '@niftykit/redeemable';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();

const tokenId = 1;
const signature = '0x5f635ae4051272d477a6ebbcdfd32d2d55a300004512c01873315194d853f15b29087799de88530240a0a0f17f5e9f8d6881b4b248ebc83c06ce7c33b9ef01971b';

const drop = await Redeemable.create(signer, contractAddress);

// get NFT
const nft = await drop.getRedeemable(tokenId);

// redeem 1 NFT
const trx = await drop.redeem(tokenId, 1, signature);
await trx.wait();

// burn NFT
await drop.burn(tokenId);

```

## API

```typescript
class Redeemable {
    static create(signerOrProvider: Signer | Provider, contractAddress: string): Promise<Redeemable | null>;
    getRedeemable(tokenId: number): Promise<RedeemableData>;
    redeem(tokenId: number, quantity: number, signature: string): Promise<ContractTransaction>;
    burn(tokenId: number): Promise<ContractTransaction>;
}

interface RedeemableData {
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
```
