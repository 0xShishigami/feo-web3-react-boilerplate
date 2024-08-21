import { createConfig, http, cookieStorage, createStorage, unstable_connector, fallback } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { Chain, Transport } from 'viem';
import { rainbowWallet, walletConnectWallet, injectedWallet } from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

import { alchemyUrls, supportedChains } from '~/data';
import { getConfig } from '../config';

const { PROJECT_ID } = getConfig();

const getWallets = () => {
  if (PROJECT_ID) {
    return [injectedWallet, rainbowWallet, walletConnectWallet];
  } else {
    return [injectedWallet];
  }
};

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: getWallets(),
    },
  ],
  {
    appName: 'Web3 React boilerplate',
    projectId: PROJECT_ID,
  },
);

const injectedConnector = unstable_connector(injected);

// RPC fallback order: Injected RPC > Alchemy RPC > Public RPC
const transports: Record<[wagmiChains.Chain, ...wagmiChains.Chain[]][number]['id'], Transport> = Object.fromEntries(
  Object.entries(alchemyUrls).map(([chainId, url]) => [chainId, fallback([injectedConnector, http(url), http()])]),
);

export const config = createConfig({
  chains: supportedChains as [Chain, ...Chain[]],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
  batch: { multicall: true },
  connectors,
});
