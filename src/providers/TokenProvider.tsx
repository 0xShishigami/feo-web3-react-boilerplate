import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { useTokenList } from '~/hooks';
import { useCustomClient } from '~/hooks/useCustomClient';
import { TokenData } from '~/types';

type ContextType = {
  tokenSelected: TokenData | undefined;
  allowance: string;

  selectToken: (token: TokenData) => void;
  setTargetAddress: (token: Address | undefined) => void;
};

interface TokenProps {
  children: ReactNode;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: TokenProps) => {
  const [defaultToken] = useTokenList(); // firt token from TokenList as default

  const [tokenSelected, selectToken] = useState<ContextType['tokenSelected']>();
  const [allowance, setAllowance] = useState<ContextType['allowance']>('0');

  const [targetAddress, setTargetAddress] = useState<Address>();
  const { address, chainId } = useAccount();

  const customClient = useCustomClient();

  const loadAllowance = useCallback(
    async (token: TokenData, _targetAddress?: Address) => {
      setAllowance('0'); // reset allowance

      if (!address || !chainId || (!targetAddress && !_targetAddress)) return;

      try {
        const result = await customClient.publicClient.readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, targetAddress ?? (_targetAddress || '0x')],
        });

        setAllowance(result.toString());
      } catch (error) {
        console.error(error);
      }
    },
    [address, targetAddress, chainId, customClient],
  );

  const handleSelectToken = (token: TokenData) => {
    if (token === tokenSelected) return;

    selectToken(token);
    loadAllowance(token);
  };

  const handleSetTargetAddress = useCallback(
    (newTargetAddress: Address | undefined) => {
      if (newTargetAddress === targetAddress) return;
      // set or reset target address
      setTargetAddress(newTargetAddress ?? undefined);

      if (newTargetAddress && tokenSelected) {
        loadAllowance(tokenSelected, newTargetAddress);
      }
    },
    [loadAllowance, targetAddress, tokenSelected],
  );

  useEffect(() => {
    defaultToken && selectToken(defaultToken.tokenData);
  }, [defaultToken]);

  return (
    <TokenContext.Provider
      value={{
        tokenSelected,
        allowance,
        selectToken: handleSelectToken,
        setTargetAddress: handleSetTargetAddress,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
