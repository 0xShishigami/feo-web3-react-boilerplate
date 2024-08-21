import { FormControl, InputLabel, MenuItem, Select, styled, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { formatUnits, isAddress } from 'viem';
import { useCustomTheme, useTokenList } from '~/hooks';
import { useToken } from '~/hooks/useToken';

export const Allowance = () => {
  const tokenList = useTokenList();
  const { allowance, tokenSelected, selectToken, setTargetAddress } = useToken();

  const [inputAddress, setInputAddress] = useState('');

  const handleChangeToken = (tokenName: string) => {
    const tokenToBeSelected = tokenList.find((t) => t.tokenData.name === tokenName);

    if (tokenToBeSelected) {
      selectToken(tokenToBeSelected.tokenData);
    }
  };

  const handleChangeInputAddress = (address: string) => {
    setInputAddress(address);

    if (isAddress(address)) {
      setTargetAddress(address);
    }
  };

  const isValidAddress = useMemo(() => isAddress(inputAddress), [inputAddress]);

  return (
    <Card>
      <FormControl fullWidth>
        <InputLabel id='select-token'>Select Token</InputLabel>
        <Select
          labelId='select-token'
          defaultValue={tokenSelected?.name || ''}
          value={tokenSelected?.name || ''}
          label='Select Token'
          onChange={(e) => handleChangeToken(e.target.value)}
        >
          {tokenList.map((t) => (
            <MenuItem key={`${t.tokenData.chainId}-${t.tokenData.address}`} value={t.tokenData.name}>
              {t.tokenData.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant='overline' display='block' my={2}>
        Allowance: {formatUnits(BigInt(allowance), tokenSelected?.decimals ?? 18)}
      </Typography>

      <TextField
        label='Target Address'
        value={inputAddress}
        onChange={(e) => handleChangeInputAddress(e.target.value)}
        error={!!inputAddress && !isValidAddress}
      />
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
