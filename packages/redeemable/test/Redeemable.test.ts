import Redeemable from '../src/index';
import { ethers } from 'ethers';

test('invalid contract address', async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider('');
    await Redeemable.create(provider, '');
  } catch (e: any) {
    expect(e.message).toMatch('Invalid contract address.');
  }
});
