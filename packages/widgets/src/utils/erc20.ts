import {
  PublicClient,
  WalletClient,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from 'viem';

export const MAINNET_APE_COIN_ADDRESS =
  '0x4d224452801aced8b2f0aebe155379bb5d594381' as `0x${string}`;
export const GOERLI_APE_COIN_ADDRESS =
  '0x9e1b542650A44C01f4bc6472F88d48eeDDf9aa75' as `0x${string}`;

const erc20ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256',
      },
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Converts a value in Wei (assuming 18 decimals) to its equivalent in a specific ERC20 token's decimal format.
 *
 * @param client - The client to use for reading the ERC20 token's decimals.
 * @param erc20address - The Ethereum address of the ERC20 token, prefixed with `0x`.
 * @param value - The value in Wei, based on 18 decimals.
 * @returns The value converted to the token's decimal format.
 */
export const convertWeiToERC20Decimals = async (
  client: PublicClient,
  erc20address: `0x${string}`,
  value: bigint // in wei, based on 18 decimals
): Promise<bigint> => {
  const decimals = await client.readContract({
    abi: erc20ABI,
    address: erc20address,
    functionName: 'decimals',
  });

  return parseUnits(formatEther(value), decimals);
};

/**
 * Converts an ERC20 token amount (in its native decimal format) back to its equivalent in Wei (18 decimals).
 *
 * @param client - The client to use for reading the ERC20 token's decimals.
 * @param erc20address - The Ethereum address of the ERC20 token, prefixed with `0x`.
 * @param value - The ERC20 token amount in its native decimals.
 * @returns The value converted back to Wei format.
 */
export const convertERC20DecimalsToWei = async (
  client: PublicClient,
  erc20address: `0x${string}`,
  value: bigint // the ERC20 token amount in its native decimals
): Promise<bigint> => {
  const decimals = await client.readContract({
    abi: erc20ABI,
    address: erc20address,
    functionName: 'decimals',
  });

  return parseEther(formatUnits(value, decimals));
};

/**
 * Gets the balance of an ERC20 token for a specific address.
 *
 * @param client - The client to use for reading the ERC20 token's decimals.
 * @param erc20address - The Ethereum address of the ERC20 token, prefixed with `0x`.
 * @param address - The Ethereum address of the account, prefixed with `0x`.
 * @returns The balance in ERC20 token's decimal format.
 */
export const getBalance = async (
  client: PublicClient,
  erc20address: `0x${string}`,
  address: `0x${string}`
): Promise<bigint> => {
  return client.readContract({
    abi: erc20ABI,
    address: erc20address,
    functionName: 'balanceOf',
    args: [address],
  });
};

/**
 * Gets the allowance of an ERC20 token for a specific address.
 *
 * @param client - The client to use for reading the ERC20 token's decimals.
 * @param erc20address - The Ethereum address of the ERC20 token, prefixed with `0x`.
 * @param owner - The Ethereum address of the account, prefixed with `0x`.
 * @param spender - The Ethereum address of the spender, prefixed with `0x`.
 * @returns The allowance in ERC20 token's decimal format.
 */
export const getAllowance = async (
  client: PublicClient,
  erc20address: `0x${string}`,
  owner: `0x${string}`,
  spender: `0x${string}`
): Promise<bigint> => {
  return client.readContract({
    abi: erc20ABI,
    address: erc20address,
    functionName: 'allowance',
    args: [owner, spender],
  });
};

/**
 * Increases the allowance of an ERC20 token for a specific address.
 *
 * @param client - The client to use for reading the ERC20 token's decimals.
 * @param walletClient - The client to use for writing the transaction.
 * @param erc20address - The Ethereum address of the ERC20 token, prefixed with `0x`.
 * @param address - The Ethereum address of the account, prefixed with `0x`.
 * @param amount - The amount to increase the allowance by, in ERC20 token's decimal format.
 * @returns The allowance in ERC20 token's decimal format.
 */
export const increaseAllowance = async (
  client: PublicClient,
  walletClient: WalletClient,
  erc20address: `0x${string}`,
  address: `0x${string}`,
  amount: bigint
): Promise<`0x${string}`> => {
  const [account] = await walletClient.getAddresses();
  const { request, result } = await client.simulateContract({
    account,
    abi: erc20ABI,
    address: erc20address,
    functionName: 'increaseAllowance',
    args: [address, amount],
  });

  if (!result) {
    throw new Error('Something went wrong.');
  }

  return walletClient.writeContract({ ...request, account });
};
