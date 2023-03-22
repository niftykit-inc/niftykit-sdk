# Diamond SDK

NiftyKit Diamond SDK Library.

## Installation

Install via npm or yarn

```bash
# with npm
npm install @niftykit/diamond

# with yarn
yarn add @niftykit/diamond
```

Or use it via CDN

```html
<script async src='https://unpkg.com/@niftykit/diamond/dist/umd/index.js'></script>
```

## How to use

```typescript
// using ethers.js
import { ethers } from 'ethers';
import Diamond from '@niftykit/diamond';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();

const diamond = await Diamond.create(signer, 'YOUR-SDK-KEY');

// mint 1 NFT
await diamond.apps.drop?.mint(1);

```
