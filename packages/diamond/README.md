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

### Drop Collection

```typescript
// using ethers.js
import { ethers } from 'ethers';
import Diamond from '@niftykit/diamond';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();

const diamond = await Diamond.create(signer, 'YOUR-SDK-KEY');

// minter
const recipient = await signer.getAddress();

// get current price
const price = await diamond.apps.drop.price();

// mint 1 NFT
const tx = await state.diamond.apps.drop.mintTo(recipient, 1, {
  value: price,
});

await tx.wait();

```

### Edition Collection

```typescript
// using ethers.js
import { ethers } from 'ethers';
import Diamond from '@niftykit/diamond';

const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
await provider.send('eth_requestAccounts', []);
const signer = provider.getSigner();

const diamond = await Diamond.create(signer, 'YOUR-SDK-KEY');

// edition id
const editionId = 0; // change this to your edition id

// get edition price
const price = await diamond.apps.edition.getEditionPrice(editionId);

// minter
const recipient = await signer.getAddress();

// check presale (if any)
const verify = await state.diamond.verifyForEdition(
  recipient,
  editionId
);

// mint 1 NFT
const tx = await diamond.apps.edition.mintEdition(
  recipient,
  editionId,
  1,
  verify?.proof ?? [],
  {
    value: price,
  }
);

await tx.wait();

```
