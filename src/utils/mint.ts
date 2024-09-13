import { Address, Chain, Hash, PublicClient, WalletClient } from 'viem';
import { WONDER_TOKEN_ABI } from '~/data';

interface MintProps {
  address: Address;
  tokenAddress: Address;
  targetAddress: Address;
  amount: string;
  chain: Chain;
  walletClient: WalletClient;
  publicClient: PublicClient;
}

export const mint = async ({
  address,
  tokenAddress,
  targetAddress,
  amount,
  chain,
  walletClient,
  publicClient,
}: MintProps): Promise<Hash | undefined> => {
  try {
    if (!address || !chain || !targetAddress) throw new Error('Missing required parameters');

    const { request } = await publicClient.simulateContract({
      account: address,
      address: tokenAddress,
      abi: WONDER_TOKEN_ABI,
      chain,
      functionName: 'mint',
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
