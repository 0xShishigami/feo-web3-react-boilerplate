import type { ReactNode } from 'react';

import { StateProvider } from './StateProvider';
import { ThemeProvider } from './ThemeProvider';
import { WalletProvider } from './WalletProvider';
import { CustomClientProvider } from './CustomClientProvider';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <StateProvider>
        <WalletProvider>
          <CustomClientProvider>{children}</CustomClientProvider>
        </WalletProvider>
      </StateProvider>
    </ThemeProvider>
  );
};
