import { Address } from 'viem';

export type TokenData = {
  address: Address;
  chainId: number;
  decimals: number;
  name: string;
};
