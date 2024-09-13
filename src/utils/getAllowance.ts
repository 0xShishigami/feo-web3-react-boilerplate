import { Address, PublicClient } from 'viem';
import { WONDER_TOKEN_ABI } from '~/data';

interface GetAllowanceProps {
  tokenAddress: Address;
  address: Address;
  targetAddress: Address;
  publicClient: PublicClient;
}

export const getAllowance = async ({ tokenAddress, address, targetAddress, publicClient }: GetAllowanceProps) => {
  try {
    const result = await publicClient.readContract({
      address: tokenAddress,
      abi: WONDER_TOKEN_ABI,
      functionName: 'allowance',
      args: [address, targetAddress],
    });

    return result.toString();
  } catch (error) {
    console.error(error);
  }
};
