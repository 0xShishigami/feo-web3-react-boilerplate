import { useContext } from 'react';
import { TxStatusContext } from '~/providers/TxStatusProvider';

export const useTxStatus = () => {
  const context = useContext(TxStatusContext);

  if (context === undefined) {
    throw new Error('useTxStatus must be used within a TxStatusProvider');
  }

  return context;
};
