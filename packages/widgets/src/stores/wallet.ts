import Diamond from '@niftykit/diamond';
import { Env } from '@stencil/core';
import { createStore } from '@stencil/store';
import {
  InjectedConnector,
  configureChains,
  createConfig,
  watchWalletClient,
} from '@wagmi/core';
import { CoinbaseWalletConnector } from '@wagmi/core/connectors/coinbaseWallet';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { publicProvider } from '@wagmi/core/providers/public';
import {
  EIP6963Connector,
  createWeb3Modal,
  walletConnectProvider,
} from '@web3modal/wagmi';
import { Chain, PublicClient, WalletClient } from 'viem';
import {
  arbitrum,
  arbitrumNova,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  cronos,
  cronosTestnet,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from 'viem/chains';
import {
  publicClientToProvider,
  walletClientToSigner,
} from '../utils/adapters';
import { getViemClientByChainId, networks } from '../utils/networks';

const projectId = Env.PROJECT_ID;
const availableChains = [
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  arbitrumNova,
  optimism,
  optimismSepolia,
  polygon,
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  cronos,
  cronosTestnet,
];

const { state } = createStore<{
  modal?: ReturnType<typeof createWeb3Modal>;
  walletClient?: WalletClient;
  publicClient?: PublicClient;
  diamond?: Diamond;
  chain?: Chain;
  isDev?: boolean;
}>({});

const metadata = {
  name: 'NiftyKit',
  description:
    'Sign Up for a NiftyKit account and create your first digital collectible in just minutes, instead of hours and days.',
  url: 'https://app.niftykit.com',
  icons: ['https://app.niftykit.com/logo-new.svg'],
};

export async function initialize(
  collectionId: string,
  isDev?: boolean
): Promise<void> {
  const data = await Diamond.getCollectionData(collectionId, isDev);
  if (!data) {
    throw new Error('Invalid collection.');
  }

  const defaultChains = availableChains.filter(
    (chain) => chain.id === data.chainId
  );
  const publicClient = getViemClientByChainId(data.chainId);

  const { chains, webSocketPublicClient } = configureChains(defaultChains, [
    jsonRpcProvider({
      rpc: (chain) => {
        const http = networks.filter((n) => n.chain.id === chain.id)[0]
          .jsonRpcProviderUrl;
        const ws = http?.replace('https', 'wss');
        return {
          http,
          ws,
        };
      },
    }),
    walletConnectProvider({ projectId }),
    publicProvider(),
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'NiftyKit',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrModalOptions: {
            themeVariables: {
              '--w3m-z-index': '99999',
            },
          },
          metadata: {
            name: 'NiftyKit',
            description:
              'Sign Up for a NiftyKit account and create your first digital collectible in just minutes, instead of hours and days.',
            url: 'https://app.niftykit.com',
            icons: ['https://app.niftykit.com/logo-new.svg'],
          },
          showQrModal: false,
          projectId,
        },
      }),
      new InjectedConnector({ chains, options: { shimDisconnect: true } }),
      new EIP6963Connector({ chains }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  state.isDev = isDev;
  state.publicClient = publicClient;
  state.modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    metadata,
    themeVariables: {
      '--w3m-font-family': 'Chivo, sans-serif',
      '--w3m-z-index': 99999,
    },
    termsConditionsUrl:
      'https://niftykit.notion.site/Terms-of-Use-d81954b4fbaf4d5da2f52a39722d532a',
    privacyPolicyUrl:
      'https://niftykit.notion.site/Privacy-Policy-6afe9633a54b4119b66a3ea1ab79cf50',
  });
  state.chain = chains[0];
  state.diamond = await Diamond.create(
    publicClientToProvider(publicClient),
    collectionId,
    data,
    isDev
  );

  watchWalletClient(
    {
      chainId: data.chainId,
    },
    async (walletClient) => {
      state.diamond = await Diamond.create(
        walletClientToSigner(walletClient),
        collectionId,
        data,
        isDev
      );
      state.walletClient = walletClient;
    }
  );
}

export default state;
