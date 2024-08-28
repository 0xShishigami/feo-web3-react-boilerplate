import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';

import { TOKEN_LIST } from '~/data';
import { useCustomClient } from '~/hooks';
import { TokenData } from '~/types';

type TokenBalance = {
  tokenData: TokenData;
  balance: string;
};

type ContextType = {
  tokenList: TokenBalance[];

  loadBalance: () => void;
};
interface TokenProps {
  children: ReactNode;
}

export const TokenListContext = createContext({} as ContextType);

export const TokenListProvider = ({ children }: TokenProps) => {
  const [tokenList, setTokenList] = useState<TokenBalance[]>([]);

  const { address, chain } = useAccount();
  const customClient = useCustomClient();

  const loadTokensBalance = useCallback(
    async (tokens: TokenData[]) => {
      try {
        if (!address) throw new Error('Address is required');

        const multicallContractsArg = tokens.map((t) => {
          return {
            address: t.address,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
          };
        });

        const balance = await customClient.publicClient.multicall({
          contracts: [...multicallContractsArg],
        });

        const formattedBalance = balance.reduce<TokenBalance[]>((acc, current, idx) => {
          const balance = current.result?.toString() ?? '0';
          const newVal = {
            tokenData: tokens[idx],
            balance,
          };
          return [...acc, newVal];
        }, []);

        return formattedBalance;
      } catch (error) {
        console.error(error);
      }
    },
    [address, customClient],
  );

  const loadTokensBalanceByCurrentChain = useCallback(() => {
    if (!chain?.id) throw new Error('Chain id not found');

    const tokensFilteredByChain = TOKEN_LIST.filter((t) => t.chainId === chain?.id);

    loadTokensBalance(tokensFilteredByChain).then((tokensBalance) => {
      setTokenList(tokensBalance ?? []);
    });
  }, [chain, loadTokensBalance]);

  useEffect(() => {
    if (!address || !chain?.id) return;
    loadTokensBalanceByCurrentChain();

    return () => {
      setTokenList([]);
    };
  }, [address, chain, loadTokensBalanceByCurrentChain]);

  return (
    <TokenListContext.Provider
      value={{
        tokenList,
        loadBalance: loadTokensBalanceByCurrentChain,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
