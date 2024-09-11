export const TOKEN_LIST = [
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

export const transactionData = {
  userAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  targetAddress: '0x1234567890123456789012345678901234567890',
  token: TOKEN_LIST[1],
  defaultToken: TOKEN_LIST[0],
  amount: '100',
  rpc: 'https://eth-sepolia.g.alchemy.com/v2/**',
  allowanceData:
    '0x095ea7b300000000000000000000000012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000000000005f5e100',
};

export const tabs = ['Allowance', 'Transfer', 'Mint'];
