import { TokenData } from '~/types';
import { WonderTokenERC20 } from './abi';

export const TOKEN_LIST: TokenData[] = [
  {
    address: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
    chainId: 11155111,
    decimals: 18,
    name: 'DAI',
  },
  {
    address: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
    chainId: 11155111,
    decimals: 6,
    name: 'USDC',
  },
];

export const WONDER_TOKEN_EVENT_APPROVAL_ABI = WonderTokenERC20[15];
export const WONDER_TOKEN_EVENT_TRANSFER_ABI = WonderTokenERC20[17];

export const WONDER_TOKEN_ABI = WonderTokenERC20;
