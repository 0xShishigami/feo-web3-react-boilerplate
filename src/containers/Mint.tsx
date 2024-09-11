import { useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import { useToken, useTokenList } from '~/hooks';

export const Mint = () => {
  const { tokenList } = useTokenList();
  const { tokenSelected, selectToken, setTargetAddress, mint } = useToken();

  const [amount, setAmount] = useState('');

  const parsedAmount = useMemo(
    () => parseUnits(amount, tokenSelected?.decimals || 18).toString(),
    [amount, tokenSelected],
  );

  const handleChangeToken = (tokenName: string) => {
    const tokenToBeSelected = tokenList.find((t) => t.tokenData.name === tokenName);

    if (tokenToBeSelected) {
      selectToken(tokenToBeSelected.tokenData);
    }
  };

  const resetForm = () => {
    setTargetAddress(undefined);
    setAmount('');
  };

  const handleMint = () => {
    mint(parsedAmount).then(() => resetForm());
  };

  const isMintDisabled = !amount || parsedAmount == '0';

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
          label='Set amount'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type='number'
          size='small'
        />
      </FormControl>

      <FormControl fullWidth margin='dense'>
        <Button onClick={handleMint} disabled={isMintDisabled} variant='outlined'>
          Mint
        </Button>
      </FormControl>
    </>
  );
};
