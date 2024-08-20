import { styled } from '@mui/material';
import { formatUnits } from 'viem';
import { useCustomTheme, useTokenList } from '~/hooks';

export const Balance = () => {
  const tokenList = useTokenList();
  return (
    <Card>
      <ul>
        {tokenList.map((t) => (
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
