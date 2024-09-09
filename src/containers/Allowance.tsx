import { useMemo, useState } from 'react';
import { formatUnits, isAddress, parseUnits } from 'viem';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

import { useToken, useTokenList } from '~/hooks';

export const Allowance = () => {
  const { tokenList } = useTokenList();
  const { allowance, tokenSelected, selectToken, setTargetAddress, approve } = useToken();

  const [inputAddress, setInputAddress] = useState('');
  const [amount, setAmount] = useState('');

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

  const resetForm = () => {
    setInputAddress('');
    setTargetAddress(undefined);
    setAmount('');
  };

  const handleApprove = () => {
    const parsedAmount = parseUnits(amount, tokenSelected?.decimals || 18).toString();

    approve(parsedAmount).then(() => resetForm());
  };

  const isValidAddress = useMemo(() => isAddress(inputAddress), [inputAddress]);

  return (
    <>
      <FormControl fullWidth margin='dense'>
        <InputLabel id='select-token'>Select Token</InputLabel>
        <Select
          labelId='select-token'
          defaultValue={tokenSelected?.name || ''}
          value={tokenSelected?.name || ''}
          label='Select Token'
          onChange={(e) => handleChangeToken(e.target.value)}
          size='small'
        >
          {tokenList.map((t) => (
            <MenuItem key={`${t.tokenData.chainId}-${t.tokenData.address}`} value={t.tokenData.name}>
              {t.tokenData.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin='dense'>
        <TextField
          label='Target Address'
          value={inputAddress}
          onChange={(e) => handleChangeInputAddress(e.target.value)}
          error={!!inputAddress && !isValidAddress}
          size='small'
        />
      </FormControl>

      <Typography variant='overline' display='block' mt={1}>
        Current Allowance: {formatUnits(BigInt(allowance), tokenSelected?.decimals ?? 18)}
      </Typography>

      <FormControl fullWidth margin='dense'>
        <TextField
          label='Set allowance'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          size='small'
        />
      </FormControl>

      <FormControl fullWidth margin='dense'>
        <Button onClick={handleApprove} disabled={!amount || !inputAddress} variant='outlined'>
          Approve
        </Button>
      </FormControl>
    </>
  );
};
