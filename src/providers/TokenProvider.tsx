import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { TOKEN_LIST } from '~/data/tokens';
import { useCustomClient } from '~/hooks/useCustomClient';
import { TokenData } from '~/types';

type TokenBalance = {
  tokenData: TokenData;
  balance: string;
  allowance: string;
};

type TokenMap = {
  [k: string]: TokenBalance;
};

type ContextType = TokenBalance[];
interface TokenProps {
  children: ReactNode;
}

export const TokenListContext = createContext({} as ContextType);

export const TokenListProvider = ({ children }: TokenProps) => {
  const [tokenHashMap, setTokenHashMap] = useState<TokenMap | null>(null);

  const { address, chain } = useAccount();
  const customClient = useCustomClient();

  const loadTokenBalance = useCallback(
    async (token: TokenData) => {
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
    },
    [address, customClient],
  );

  useEffect(() => {
    if (!address) return;

    TOKEN_LIST.forEach(async (t) => {
      if (t.chainId === chain?.id) {
        const tokenBalance = await loadTokenBalance(t);

        if (tokenBalance) {
          setTokenHashMap((prev) => {
            const newMap = prev ?? {};
            newMap[t.name] = {
              tokenData: t,
              balance: tokenBalance[0],
              allowance: tokenBalance[1],
            };
            return newMap;
          });
        }
      }
    });

    return () => {
      setTokenHashMap(null);
    };
  }, [address, chain, loadTokenBalance]);

  return <TokenListContext.Provider value={Object.values(tokenHashMap || {})}>{children}</TokenListContext.Provider>;
};
