import { Address, PublicClient } from 'viem';
import { WONDER_TOKEN_ABI, WONDER_TOKEN_EVENTS } from '~/data';
import { EventLogs, TokenData } from '~/types';

interface GetTransferLogsProps {
  tokenAddress: Address;
  fromAddress: Address;
  publicClient: PublicClient;
}

const getTransferLogs = async ({ tokenAddress, fromAddress, publicClient }: GetTransferLogsProps) => {
  try {
    const transferLogs = await publicClient.getLogs({
      address: tokenAddress,
      event: WONDER_TOKEN_EVENTS.Transfer,
      args: { from: fromAddress },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return transferLogs as unknown as EventLogs[];
  } catch (error) {
    console.error(error);
  }
};

interface GetApprovalLogsProps {
  tokenAddress: Address;
  ownerAddress: Address;
  publicClient: PublicClient;
}

const getApprovalLogs = async ({ tokenAddress, ownerAddress, publicClient }: GetApprovalLogsProps) => {
  try {
    const approvalLogs = await publicClient.getLogs({
      address: tokenAddress,
      event: WONDER_TOKEN_EVENTS.Approval,
      args: { owner: ownerAddress },
      fromBlock: 'earliest',
      toBlock: 'latest',
    });

    return approvalLogs as unknown as EventLogs[];
  } catch (error) {
    console.error(error);
  }
};

interface GetTransferAndApprovalLogsProps {
  tokens: TokenData[];
  address: Address;
  publicClient: PublicClient;
}

export const getTransferAndApprovalLogs = async ({
  tokens,
  address,
  publicClient,
}: GetTransferAndApprovalLogsProps): Promise<EventLogs[] | undefined> => {
  try {
    const logs: EventLogs[] = [];

    for (const tokenData of tokens) {
      const { address: tokenAddress } = tokenData;

      const transferLogs = (await getTransferLogs({ tokenAddress, fromAddress: address, publicClient })) || [];
      const approvalLogs = (await getApprovalLogs({ tokenAddress, ownerAddress: address, publicClient })) || [];

      const tmpLogs: EventLogs[] = [...transferLogs, ...approvalLogs];

      // add tokenData to logs
      tmpLogs.forEach((log) => {
        log.tokenData = tokenData;
      });

      logs.push(...tmpLogs);
    }

    // sort logs desc by blockNumber
    logs.sort((a, b) => {
      if (a.blockNumber === null || b.blockNumber === null) {
        return 0;
      }
      return Number(b.blockNumber) - Number(a.blockNumber);
    });

    return logs;
  } catch (error) {
    console.error(error);
  }
};

interface WatchTransferLogsProps {
  tokenAddress: Address;
  callback: () => void;
  publicClient: PublicClient;
}

const watchTransferLogs = ({ tokenAddress, callback, publicClient }: WatchTransferLogsProps) => {
  return publicClient.watchContractEvent({
    address: tokenAddress,
    abi: WONDER_TOKEN_ABI,
    eventName: 'Transfer',
    onLogs: () => callback(),
  });
};

interface WatchApprovalLogsProps {
  tokenAddress: Address;
  callback: () => void;
  publicClient: PublicClient;
}

const watchApprovalLogs = ({ tokenAddress, callback, publicClient }: WatchApprovalLogsProps) => {
  return publicClient.watchContractEvent({
    address: tokenAddress,
    abi: WONDER_TOKEN_ABI,
    eventName: 'Approval',
    onLogs: () => callback(),
  });
};

export const watchTransferAndApprovalLogs = (
  tokenAddress: Address,
  callback: () => void,
  publicClient: PublicClient,
) => {
  const unwatchTransferEvents = watchTransferLogs({ tokenAddress, callback, publicClient });
  const unwatchApprovalEvents = watchApprovalLogs({ tokenAddress, callback, publicClient });

  return () => {
    unwatchTransferEvents();
    unwatchApprovalEvents();
  };
};
