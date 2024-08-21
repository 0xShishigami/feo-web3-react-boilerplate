import { Box, styled, Typography } from '@mui/material';
import { formatUnits } from 'viem';
import { useCustomTheme, useTokenList } from '~/hooks';

export const Balance = () => {
  const tokenList = useTokenList();
  return (
    <Card>
      {tokenList.map((t) => (
        <Box key={`${t.tokenData.chainId}-${t.tokenData.address}`} textAlign='center'>
          <Typography variant='h6'>{t.tokenData.name}</Typography>
          <Typography variant='body1'>Balance: {formatUnits(BigInt(t.balance), t.tokenData.decimals)}</Typography>
        </Box>
      ))}
    </Card>
  );
};

const Card = styled('div')(() => {
  const { currentTheme } = useCustomTheme();
  return {
    boxShadow: currentTheme.cardBoxShadow,
    padding: '2rem',
    borderRadius: currentTheme.borderRadius,
    display: 'flex',
    gap: '2rem',
  };
});
