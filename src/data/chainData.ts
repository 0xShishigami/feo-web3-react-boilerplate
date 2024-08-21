import { Chain, sepolia } from 'viem/chains';
import { getConfig } from '~/config';

export const TESTNET_CHAINS: Chain[] = [sepolia];

const { ALCHEMY_KEY } = getConfig();

export const testnetAlchemyUrls: { [k: string]: string } = {
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`,
};

export const alchemyUrls: { [k: string]: string } = {
  ...testnetAlchemyUrls,
};

// Currently required for wagmi config
export const supportedChains = [...TESTNET_CHAINS] as const;
