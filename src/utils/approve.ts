import { Address, Chain, Hash, PublicClient, WalletClient } from 'viem';
import { WONDER_TOKEN_ABI } from '~/data';

interface ApproveProps {
  address: Address;
  tokenAddress: Address;
  targetAddress: Address;
  amount: string;
  chain: Chain;
  walletClient: WalletClient;
  publicClient: PublicClient;
}

export const approve = async ({
  address,
  tokenAddress,
  targetAddress,
  amount,
  chain,
  walletClient,
  publicClient,
}: ApproveProps): Promise<Hash | undefined> => {
  try {
    if (!address || !chain || !targetAddress) throw new Error('Missing required parameters');

    const { request } = await publicClient.simulateContract({
      account: address,
      address: tokenAddress,
      abi: WONDER_TOKEN_ABI,
      chain,
      functionName: 'approve',
      args: [targetAddress, BigInt(amount)],
    });

    const hash = await walletClient.writeContract({
      ...request,
      account: address,
    });

    return hash;
  } catch (error) {
    console.error(error);
  }
};
