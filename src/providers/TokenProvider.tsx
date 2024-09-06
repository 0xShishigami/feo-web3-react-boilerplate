import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { Address, GetBlockNumberErrorType, Log } from 'viem';
import { useAccount } from 'wagmi';

import { WONDER_TOKEN_ABI, WONDER_TOKEN_EVENT_APPROVAL_ABI, WONDER_TOKEN_EVENT_TRANSFER_ABI } from '~/data';
import { useCustomClient, useTokenList, useSetNotification } from '~/hooks';
import { TokenData } from '~/types';

type EventLogs = Log &
  (
    | {
        eventName: 'Transfer';
        args: {
          from: string;
          to: string;
          value: string;
        };
      }
    | {
        eventName: 'Approval';
        args: {
          owner: string;
          spender: string;
          value: string;
        };
      }
  );

type ContextType = {
  tokenSelected: TokenData | undefined;
  allowance: string;

  selectToken: (token: TokenData) => void;
  setTargetAddress: (token: Address | undefined) => void;

  approve: (amount: string) => Promise<string | undefined>;
  transfer: (amount: string) => Promise<string | undefined>;
  mint: (amount: string) => Promise<string | undefined>;

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

  const [logs, setLogs] = useState<ContextType['logs']>([]);

  const [targetAddress, setTargetAddress] = useState<Address>();
  const { address, chain, chainId } = useAccount();

  const customClient = useCustomClient();
  const setNotification = useSetNotification();

  const loadAllowance = useCallback(
    async (token: TokenData, _targetAddress?: Address) => {
      setAllowance('0'); // reset allowance

      if (!address || !chainId || (!targetAddress && !_targetAddress)) return;

      try {
        const result = await customClient.publicClient.readContract({
          address: token.address,
          abi: WONDER_TOKEN_ABI,
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

  const writeContractWithNotifications = async (
    simulateContract: () => ReturnType<typeof customClient.publicClient.simulateContract>,
    successCallback: () => void,
    errorMessage: string,
  ) => {
    if (!address || !chainId || !tokenSelected) return;

    try {
      const { request } = await simulateContract();

      const hash = await customClient.walletClient?.writeContract({
        ...request,
        account: address, // override account to avoid ts error
      });

      // if there is no hash and not error is thrown by viem
      if (!hash) {
        const uErr = new Error(errorMessage);
        uErr.name = 'UnknownError';
        throw uErr;
      }

      setNotification({
        type: 'loading',
        message: 'Pending Transaction',
        link: {
          href: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
          text: 'See transaction',
        },
        timeout: 0,
      });

      await customClient.publicClient.waitForTransactionReceipt({ hash });

      successCallback();

      return hash.toString();
    } catch (error: unknown) {
      console.error(error);
      setNotification({
        type: 'error',
        message: `${errorMessage}. Error: ` + (error as GetBlockNumberErrorType)?.name,
        timeout: 0,
      });
    }
  };

  const approve = async (amount: string) => {
    if (!targetAddress) throw new Error('Target address is not set');

    return writeContractWithNotifications(
      () =>
        customClient.publicClient.simulateContract({
          account: address,
          address: tokenSelected!.address,
          abi: WONDER_TOKEN_ABI,
          functionName: 'approve',
          chain: chain,
          args: [targetAddress!, BigInt(amount)],
        }),
      () => {
        setAllowance(amount);
      },
      'Approve transaction failed',
    );
  };

  const transfer = async (amount: string) => {
    if (!targetAddress) throw new Error('Target address is not set');

    return writeContractWithNotifications(
      () =>
        customClient.publicClient.simulateContract({
          account: address,
          address: tokenSelected!.address,
          abi: WONDER_TOKEN_ABI,
          functionName: 'transfer',
          chain: chain,
          args: [targetAddress!, BigInt(amount)],
        }),
      () => {
        loadBalance();
      },
      'Transfer transaction failed',
    );
  };

  const mint = async (amount: string) => {
    return writeContractWithNotifications(
      () =>
        customClient.publicClient.simulateContract({
          account: address,
          address: tokenSelected!.address,
          abi: WONDER_TOKEN_ABI,
          functionName: 'mint',
          chain: chain,
          args: [address!, BigInt(amount)],
        }),
      () => {
        loadBalance();
      },
      'Mint transaction failed',
    );
  };

  const loadTransferAndApprovalLogs = useCallback(async () => {
    if (!tokenSelected || !address) return;

    const transferLogs = await customClient.publicClient.getLogs({
      address: tokenSelected.address,
      event: WONDER_TOKEN_EVENT_TRANSFER_ABI,
      args: { from: address },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    const approvalLogs = await customClient.publicClient.getLogs({
      address: tokenSelected.address,
      event: WONDER_TOKEN_EVENT_APPROVAL_ABI,
      args: { owner: address },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    const tmpLogs = [...transferLogs, ...approvalLogs];

    const sortedLogs = tmpLogs.sort((a, b) => {
      if (a.blockNumber && b.blockNumber) {
        return Number(b.blockNumber) - Number(a.blockNumber);
      }
      return 0;
    });

    setLogs(sortedLogs as unknown as EventLogs[]);
  }, [address, customClient.publicClient, tokenSelected]);

  useEffect(() => {
    defaultToken && selectToken(defaultToken.tokenData);
  }, [defaultToken]);

  useEffect(() => {
    if (!tokenSelected || !address) return;

    const unwatchTransferEvents = customClient.publicClient.watchContractEvent({
      address: tokenSelected?.address,
      abi: WONDER_TOKEN_ABI,
      eventName: 'Transfer',
      onLogs: () => loadTransferAndApprovalLogs(),
    });

    const unwatchApprovalEvents = customClient.publicClient.watchContractEvent({
      address: tokenSelected?.address,
      abi: WONDER_TOKEN_ABI,
      eventName: 'Approval',
      onLogs: () => loadTransferAndApprovalLogs(),
    });

    loadTransferAndApprovalLogs();

    return () => {
      unwatchTransferEvents();
      unwatchApprovalEvents();
    };
  }, [customClient.publicClient, tokenSelected, address, loadTransferAndApprovalLogs]);

  return (
    <TokenContext.Provider
      value={{
        tokenSelected,
        allowance,
        selectToken: handleSelectToken,
        setTargetAddress: handleSetTargetAddress,
        approve,
        transfer,
        mint,
        logs,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
