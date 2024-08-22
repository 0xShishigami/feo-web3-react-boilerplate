import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Address, erc20Abi } from 'viem';
import { useAccount } from 'wagmi';
import { useTokenList, useCustomClient } from '~/hooks';
import { TokenData } from '~/types';

type ContextType = {
  tokenSelected: TokenData | undefined;
  allowance: string;

  selectToken: (token: TokenData) => void;
  setTargetAddress: (token: Address | undefined) => void;

  approve: (amount: string) => Promise<string | undefined>;
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
  const { address, chain, chainId } = useAccount();

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

  const approve = async (amount: string) => {
    if (!address || !chainId || !tokenSelected || !targetAddress) return;

    try {
      const { request } = await customClient.publicClient.simulateContract({
        account: address,
        address: tokenSelected.address,
        abi: erc20Abi,
        functionName: 'approve',
        chain: chain,
        args: [targetAddress, BigInt(amount)],
      });

      const hash = await customClient.walletClient?.writeContract(request);

      if (!hash) throw new Error('Approve transaction failed');

      await customClient.publicClient.waitForTransactionReceipt({ hash });
      setAllowance(amount);

      return hash.toString();
    } catch (error) {
      console.error(error);
    }
  };

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
        approve,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
