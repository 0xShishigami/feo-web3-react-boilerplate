import { useMemo, useState } from 'react';
import { isAddress, parseUnits } from 'viem';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { useToken, useTokenList } from '~/hooks';

export const Transfer = () => {
  const { tokenList } = useTokenList();
  const { tokenSelected, selectToken, setTargetAddress, transfer } = useToken();

  const [inputAddress, setInputAddress] = useState('');
  const [amount, setAmount] = useState('');

  const parsedAmount = useMemo(
    () => parseUnits(amount, tokenSelected?.decimals || 18).toString(),
    [amount, tokenSelected],
  );

  const tokenSelectedBalance = useMemo(() => {
    if (tokenSelected) {
      const balance = tokenList.find((t) => t.tokenData.name === tokenSelected.name)?.balance;

      return balance ?? '0';
    }
  }, [tokenSelected, tokenList]);

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

  const handleTransfer = () => {
    transfer(parsedAmount).then(() => resetForm());
  };

  const isValidAddress = useMemo(() => isAddress(inputAddress), [inputAddress]);
  const isBalanceEnough = tokenSelectedBalance && parsedAmount <= tokenSelectedBalance;
  const isTransferDisabled = !amount || parsedAmount == '0n' || !inputAddress || !isValidAddress || !isBalanceEnough;

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

      <FormControl fullWidth margin='dense'>
        <TextField
          label='Set amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          size='small'
          error={!isBalanceEnough}
          helperText={isBalanceEnough ? '' : 'Insufficient balance'}
        />
      </FormControl>

      <FormControl fullWidth margin='dense'>
        <Button onClick={handleTransfer} disabled={isTransferDisabled} variant='outlined'>
          Transfer
        </Button>
      </FormControl>
    </>
  );
};
