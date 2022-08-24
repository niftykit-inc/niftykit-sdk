# DropKit SDK

NiftyKit DropKit SDK Library.

## Installation

Install via npm or yarn

```bash
# with npm
npm install @niftykit/dropkit

# with yarn
yarn add @niftykit/dropkit
```

Or use it via CDN

```html
<script async src='https://unpkg.com/@niftykit/dropkit/dist/umd/index.js'></script>
```

## How to use

```typescript
// using ethers.js
import { ethers } from 'ethers';
import DropKit from '@niftykit/dropkit';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();

const drop = await DropKit.create(signer, 'YOUR-SDK-KEY');

// mint 1 NFT
await drop.mint(1);

```

## API

```typescript
class DropKit {
    static create(signerOrProvider: Signer | Provider, key: string, isDev?: boolean): Promise<DropKit | null>;
    static getCollectionData(key: string, isDev?: boolean): Promise<DropApiResponse & ErrorApiResponse>;
    price(): Promise<BigNumber>;
    maxAmount(): Promise<BigNumber>;
    maxPerMint(): Promise<BigNumber>;
    maxPerWallet(): Promise<BigNumber>;
    totalSupply(): Promise<BigNumber>;
    saleActive(): Promise<boolean>;
    presaleActive(): Promise<boolean>;
    generateProof(address: string): Promise<ProofApiResponse & ErrorApiResponse>;
    mint(quantity: number): Promise<ContractReceipt | null>;
}
```
