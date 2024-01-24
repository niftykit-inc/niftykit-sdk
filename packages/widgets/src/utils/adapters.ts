import { type Config, getClient, getConnectorClient } from '@wagmi/core';
import { providers } from 'ethers';
import type { Account, Client, Chain, Transport } from 'viem';

export const clientToProvider = (client: Client<Transport, Chain>) => {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
};

export const clientToSigner = (
  client: Client<Transport, Chain, Account | undefined>
) => {
  if (!client.account) throw new Error('No account found');
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};

/** Action to convert a viem Public Client to an ethers.js Provider. */
export const getEthersProvider = (
  config: Config,
  { chainId }: { chainId?: number } = {}
) => {
  const client = getClient(config, { chainId });
  return clientToProvider(client);
};

/** Action to convert a Viem Client to an ethers.js Signer. */
export const getEthersSigner = async (
  config: Config,
  { chainId }: { chainId?: number } = {}
) => {
  const client = await getConnectorClient(config, { chainId });
  return clientToSigner(client);
};
