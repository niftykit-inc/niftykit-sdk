import { type WalletClient, type PublicClient } from '@wagmi/core';
import { Signer, providers } from 'ethers';
import {
  Provider,
  ExternalProvider,
  JsonRpcFetchFunc,
} from '@ethersproject/providers';
import { type HttpTransport } from 'viem';

export const publicClientToProvider = (
  publicClient: PublicClient
): Provider => {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
};

export const walletClientToSigner = (walletClient: WalletClient): Signer => {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(
    transport as ExternalProvider | JsonRpcFetchFunc,
    network
  );
  const signer = provider.getSigner(account.address);
  return signer;
};
