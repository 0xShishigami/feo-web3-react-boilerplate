import { formatUnits } from 'viem';
import { Box, styled, Typography } from '@mui/material';

import { useCustomTheme, useTokenList } from '~/hooks';
import { FORM_MIN_WIDTH } from '~/utils';

export const Balance = () => {
  const { tokenList } = useTokenList();
  return (
    <Card data-testid='balance'>
      {tokenList.map((t) => (
        <Box
          key={`${t.tokenData.chainId}-${t.tokenData.address}`}
          textAlign='center'
          data-testid={`balance-${t.tokenData.name}`}
        >
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
    minWidth: `${FORM_MIN_WIDTH}rem`,
    boxShadow: currentTheme.cardBoxShadow,
    padding: '2rem 4rem',
    borderRadius: currentTheme.borderRadius,
    display: 'flex',
    justifyContent: 'space-around',
    gap: '2rem',
  };
});
