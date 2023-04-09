import Diamond from '../src/index';
import { ethers } from 'ethers';

test('missing SDK key', async () => {
  try {
    const provider = new ethers.providers.JsonRpcProvider('');
    await Diamond.create(provider, '');
  } catch (e: any) {
    expect(e.message).toMatch('No SDK key.');
  }
});
