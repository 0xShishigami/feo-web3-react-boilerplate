import type { ReactNode } from 'react';

import { ThemeProvider } from './ThemeProvider';
import { WalletProvider } from './WalletProvider';
import { CustomClientProvider } from './CustomClientProvider';
import { TokenListProvider } from './TokenListProvider';
import { TokenProvider } from './TokenProvider';
import { TxStatusProvider } from './TxStatusProvider';
import NotificationProvider from './NotificationProvider';

type Props = {
  children: ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <WalletProvider>
          <CustomClientProvider>
            <TxStatusProvider>
              <TokenListProvider>
                <TokenProvider>{children}</TokenProvider>
              </TokenListProvider>
            </TxStatusProvider>
          </CustomClientProvider>
        </WalletProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};
