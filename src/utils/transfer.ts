import { Address, Chain, Hash, PublicClient, WalletClient } from 'viem';
import { WONDER_TOKEN_ABI } from '~/data';

interface TransferProps {
  address: Address;
  tokenAddress: Address;
  targetAddress: Address;
  amount: string;
  chain: Chain;
  walletClient: WalletClient;
  publicClient: PublicClient;
}

export const transfer = async ({
  address,
  tokenAddress,
  targetAddress,
  amount,
  chain,
  walletClient,
  publicClient,
}: TransferProps): Promise<Hash | undefined> => {
  try {
    if (!address || !chain || !targetAddress) throw new Error('Missing required parameters');

    const { request } = await publicClient.simulateContract({
      account: address,
      address: tokenAddress,
      abi: WONDER_TOKEN_ABI,
      chain,
      functionName: 'transfer',
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
