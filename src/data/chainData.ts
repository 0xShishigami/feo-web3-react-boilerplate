import { Chain, mainnet, sepolia } from 'viem/chains';
import { getConfig } from '~/config';

export const TESTNET_CHAINS: Chain[] = [sepolia];

export const MAINNET_CHAINS: Chain[] = [mainnet];

const { ALCHEMY_KEY } = getConfig();

export const testnetAlchemyUrls: { [k: string]: string } = {
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const mainnetAlchemyUrls: { [k: string]: string } = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const alchemyUrls: { [k: string]: string } = {
  ...testnetAlchemyUrls,
  ...mainnetAlchemyUrls,
};

// Currently required for wagmi config
export const supportedChains = [...MAINNET_CHAINS, ...TESTNET_CHAINS] as const;
