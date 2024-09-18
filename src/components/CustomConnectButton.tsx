import { Button, CircularProgress } from '@mui/material';
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { getConfig } from '~/config';
import { truncateAddress } from '~/utils';

const { TEST_MODE } = getConfig();

export const CustomConnectButton = () => {
  const { connect, connectors } = useConnect();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (address && openAccountModal) {
      openAccountModal();
    } else if (openConnectModal) {
      setIsLoading(true);
      TEST_MODE ? connect({ connector: connectors[0] }) : openConnectModal();
    }
  };

  useEffect(() => {
    !connectModalOpen && setIsLoading(false);
  }, [address, connectModalOpen]);

  return (
    <Button onClick={handleClick} data-testid='connect-button' variant='outlined' disableRipple>
      {!address && !isLoading && 'Connect Wallet'}
      {address && !isLoading && truncateAddress(address)}
      {isLoading && <CircularProgress size={24} />}
    </Button>
  );
};
