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

type TokenMap = {
  [k: string]: TokenBalance;
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
  const [tokenHashMap, setTokenHashMap] = useState<TokenMap | null>(null);

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
      tokensBalance?.forEach((t) => {
        setTokenHashMap((prev) => {
          const newMap = prev ?? {};
          newMap[t.tokenData.name] = t;
          return newMap;
        });
      });
    });
  }, [chain, loadTokensBalance]);

  useEffect(() => {
    if (!address || !chain?.id) return;
    loadTokensBalanceByCurrentChain();

    return () => {
      setTokenHashMap(null);
    };
  }, [address, chain, loadTokensBalanceByCurrentChain]);

  return (
    <TokenListContext.Provider
      value={{
        tokenList: Object.values(tokenHashMap || {}),
        loadBalance: loadTokensBalanceByCurrentChain,
      }}
    >
      {children}
    </TokenListContext.Provider>
  );
};
