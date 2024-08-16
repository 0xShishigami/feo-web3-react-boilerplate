import { useContext } from 'react';
import { TokenListContext } from '~/providers/TokenProvider';

export const useTokenList = () => {
  const context = useContext(TokenListContext);

  if (context === undefined) {
    throw new Error('useTokenList must be used within a StateProvider');
  }

  return context;
};
