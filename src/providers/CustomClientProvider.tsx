import { createContext, ReactNode, useCallback, useMemo } from 'react';
import { createPublicClient, createWalletClient, custom, fallback, http, PublicClient, WalletClient } from 'viem';
import { useAccount, useConfig } from 'wagmi';
import { alchemyUrls } from '~/data';

type ContextType = {
  publicClient: PublicClient;
  walletClient: WalletClient | undefined;
};

interface CustomClientProps {
  children: ReactNode;
}

export const CustomClientContext = createContext({} as ContextType);

export const CustomClientProvider = ({ children }: CustomClientProps) => {
  const { address, chain } = useAccount();
  const { chains } = useConfig();

  const isInjected = typeof window !== 'undefined' && window.ethereum;

  const getPublicTransport = useCallback(
    (chainId: number) =>
      isInjected
        ? fallback([http(alchemyUrls[chainId]), custom(window.ethereum), http()])
        : fallback([http(alchemyUrls[chainId]), http()]),
    [isInjected],
  );

  const walletClient = useMemo(() => {
    if (isInjected) {
      return createWalletClient({
        account: address,
        chain: chain,
        transport: custom(window.ethereum),
      });
    }
  }, [address, chain, isInjected]);

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: chain,
      transport: getPublicTransport(chain?.id ?? chains[0].id),
      batch: {
        multicall: {
          wait: 40,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, getPublicTransport]);

  return (
    <CustomClientContext.Provider
      value={{
        walletClient,
        publicClient,
      }}
    >
      {children}
    </CustomClientContext.Provider>
  );
};
