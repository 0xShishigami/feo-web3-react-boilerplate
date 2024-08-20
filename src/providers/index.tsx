import type { ReactNode } from 'react';

import { StateProvider } from './StateProvider';
import { ThemeProvider } from './ThemeProvider';
import { WalletProvider } from './WalletProvider';
import { CustomClientProvider } from './CustomClientProvider';
import { TokenListProvider } from '~/providers/TokenListProvider';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <StateProvider>
        <WalletProvider>
          <CustomClientProvider>
            <TokenListProvider>{children}</TokenListProvider>
          </CustomClientProvider>
        </WalletProvider>
      </StateProvider>
    </ThemeProvider>
  );
};
