import { styled } from '@mui/material';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useCustomTheme } from '~/hooks';
import { useTokenList } from '~/hooks/useTokenList';

export const Balance = () => {
  const { chain } = useAccount();
  const tokenList = useTokenList();
  const tokenListByChain = useMemo(() => tokenList.filter((t) => t.tokenData.chainId === chain?.id), [chain]);
  return (
    <Card>
      <ul>
        {tokenListByChain.map((t) => (
          <li key={`${t.tokenData.chainId}-${t.tokenData.address}`}>
            <p>
              <b>{t.tokenData.name}</b>
              <br />
              Balance: {formatUnits(BigInt(t.balance), t.tokenData.decimals)}
              <br />
              Allowance: {formatUnits(BigInt(t.allowance), t.tokenData.decimals)}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

const Card = styled('main')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    boxShadow: currentTheme.cardBoxShadow,
    padding: '2rem',
    borderRadius: currentTheme.borderRadius,
  };
});
