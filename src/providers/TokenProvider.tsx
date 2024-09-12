import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Address, WalletClient } from 'viem';
import { useAccount } from 'wagmi';

import { useCustomClient, useTokenList, useNotificateTxState } from '~/hooks';
import { EventLogs, TokenData } from '~/types';
import {
  approve,
  getAllowance,
  getTransferAndApprovalLogs,
  mint,
  transfer,
  watchTransferAndApprovalLogs,
} from '~/utils';

type ContextType = {
  tokenSelected: TokenData | undefined;
  allowance: string;

  selectToken: (token: TokenData) => void;
  setTargetAddress: (token: Address | undefined) => void;

  approve: (amount: string) => Promise<void>;
  transfer: (amount: string) => Promise<void>;
  mint: (amount: string) => Promise<void>;

  logs: EventLogs[];
};

interface TokenProps {
  children: ReactNode;
}

export const TokenContext = createContext({} as ContextType);

export const TokenProvider = ({ children }: TokenProps) => {
  const { tokenList, loadBalance } = useTokenList();
  const defaultToken = tokenList[0]; // first token from TokenList as default

  const [tokenSelected, selectToken] = useState<ContextType['tokenSelected']>();
  const [allowance, setAllowance] = useState<ContextType['allowance']>('0');
  const [targetAddress, setTargetAddress] = useState<Address>();
  const [logs, setLogs] = useState<ContextType['logs']>([]);

  const { address, chain } = useAccount();
  const customClient = useCustomClient();
  const notificateTxState = useNotificateTxState();

  const loadAllowance = useCallback(
    async (token: TokenData, _targetAddress?: Address) => {
      setAllowance('0'); // reset allowance

      if (!address || !chain || (!targetAddress && !_targetAddress)) return;

      const result = await getAllowance({
        tokenAddress: token.address,
        address,
        targetAddress: targetAddress || _targetAddress || '0x',
        publicClient: customClient.publicClient,
      });

      if (result === 'undefined') throw new Error('Load allowance result is undefined');

      setAllowance(result?.toString() || '0');
    },
    [address, targetAddress, chain, customClient],
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

  const approveTransaction = async (amount: string) => {
    if (!address || !chain || !tokenSelected) return;
    if (!targetAddress) throw new Error('Target address is not set');

    try {
      const hash = await approve({
        address,
        tokenAddress: tokenSelected.address,
        targetAddress,
        amount,
        chain,
        walletClient: customClient.walletClient as WalletClient,
        publicClient: customClient.publicClient,
      });

      if (!hash) {
        const uErr = new Error('Tx hash is undefined');
        uErr.name = 'UnknownError';
        throw uErr;
      }

      notificateTxState({ type: 'loading', hash });

      await customClient.publicClient.waitForTransactionReceipt({ hash });

      loadAllowance(tokenSelected);
      notificateTxState({ type: 'success', hash, message: 'Approve transaction success' });
    } catch (error) {
      notificateTxState({ type: 'error', error });
    }
  };

  const transferTransaction = async (amount: string) => {
    if (!address || !chain || !tokenSelected) return;
    if (!targetAddress) throw new Error('Target address is not set');

    try {
      const hash = await transfer({
        address,
        tokenAddress: tokenSelected.address,
        targetAddress,
        amount,
        chain,
        walletClient: customClient.walletClient as WalletClient,
        publicClient: customClient.publicClient,
      });

      if (!hash) {
        const uErr = new Error('Tx hash is undefined');
        uErr.name = 'UnknownError';
        throw uErr;
      }

      notificateTxState({ type: 'loading', hash });

      await customClient.publicClient.waitForTransactionReceipt({ hash });

      loadBalance();
      notificateTxState({ type: 'success', hash, message: 'Transfer transaction success' });
    } catch (error) {
      notificateTxState({ type: 'error', error });
    }
  };

  const mintTransaction = async (amount: string) => {
    if (!address || !chain || !tokenSelected) return;

    try {
      const hash = await mint({
        address,
        tokenAddress: tokenSelected.address,
        targetAddress: address,
        amount,
        chain,
        walletClient: customClient.walletClient as WalletClient,
        publicClient: customClient.publicClient,
      });

      if (!hash) {
        const uErr = new Error('Tx hash is undefined');
        uErr.name = 'UnknownError';
        throw uErr;
      }

      notificateTxState({ type: 'loading', hash });

      await customClient.publicClient.waitForTransactionReceipt({ hash });

      loadBalance();
      notificateTxState({ type: 'success', hash, message: 'Mint transaction success' });
    } catch (error) {
      notificateTxState({ type: 'error', error });
    }
  };

  const loadTransferAndApprovalLogs = useCallback(async () => {
    if (!tokenSelected || !address) return;

    const logs = await getTransferAndApprovalLogs({
      tokens: tokenList.map((token) => token.tokenData),
      address,
      publicClient: customClient.publicClient,
    });

    if (!logs) throw new Error('Load logs failed');

    setLogs(logs);
  }, [address, customClient.publicClient, tokenList, tokenSelected]);

  // set default token when loaded
  useEffect(() => {
    defaultToken && selectToken(defaultToken.tokenData);
  }, [defaultToken]);

  // load and watch for new logs
  useEffect(() => {
    if (!tokenSelected || !address) return;

    const unwatch = watchTransferAndApprovalLogs(
      tokenSelected.address,
      loadTransferAndApprovalLogs,
      customClient.publicClient,
    );

    loadTransferAndApprovalLogs();

    return () => {
      unwatch();
    };
  }, [customClient.publicClient, tokenSelected, address, loadTransferAndApprovalLogs]);

  return (
    <TokenContext.Provider
      value={{
        tokenSelected,
        allowance,
        selectToken: handleSelectToken,
        setTargetAddress: handleSetTargetAddress,
        approve: approveTransaction,
        transfer: transferTransaction,
        mint: mintTransaction,
        logs,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
