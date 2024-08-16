import { createContext, ReactNode, useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { TOKEN_LIST } from '~/data/tokens';
import { useCustomClient } from '~/hooks/useCustomClient';
import { TokenData } from '~/types';

type ContextType = {
  tokenData: TokenData;
  balance: string;
  allowance: string;
}[];

interface TokenProps {
  children: ReactNode;
}

const tokenListOnlyData = TOKEN_LIST.map((t) => {
  return {
    tokenData: t,
    balance: '',
    allowance: '',
  };
});

export const TokenListContext = createContext({} as ContextType);

export const TokenListProvider = ({ children }: TokenProps) => {
  const [tokenList, setTokenList] = useState<ContextType>(tokenListOnlyData);

  const { address, chain } = useAccount();
  const customClient = useCustomClient();

  const loadTokenBalance = async (token: TokenData) => {
    try {
      if (!address) throw new Error('Address is required');
      const [_balance, _allowance] = await customClient.publicClient.multicall({
        contracts: [
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address: token.address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, token.address],
          },
        ],
      });

      const balance = _balance.result?.toString() ?? '0';
      const allowance = _allowance.result?.toString() ?? '0';

      return [balance, allowance];
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!address) return;

    tokenList.forEach(async (t) => {
      const tokenBalance = await loadTokenBalance(t.tokenData);
      if (tokenBalance) {
        setTokenList([...tokenList, { ...t, balance: tokenBalance[0], allowance: tokenBalance[1] }]);
      }
    });

    return () => {
      setTokenList(tokenListOnlyData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain]);

  return <TokenListContext.Provider value={tokenList}>{children}</TokenListContext.Provider>;
};
