import { useContext } from 'react';
import { CustomClientContext } from '~/providers/CustomClientProvider';

export const useCustomClient = () => {
  const context = useContext(CustomClientContext);

  if (context === undefined) {
    throw new Error('useCustomClient must be used within a StateProvider');
  }

  return context;
};
