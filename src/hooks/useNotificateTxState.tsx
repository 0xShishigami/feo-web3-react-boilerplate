import { GetBlockNumberErrorType, Hash } from 'viem';
import { useAccount } from 'wagmi';
import { useSetNotification } from '~/hooks/useNotification';

const pendingMessage = 'Pending Transaction',
  successMessage = 'Transaction successful',
  errorMessage = 'Error while processing transaction';

const defaultBlockExplorer = '';

export const useNotificateTxState = () => {
  const setNotification = useSetNotification();
  const { chain } = useAccount();

  const blockExplorer = chain?.blockExplorers?.default.url || defaultBlockExplorer;

  const notificateTxPending = (hash: Hash, message: string = pendingMessage) => {
    setNotification({
      type: 'loading',
      message,
      link: {
        href: `${blockExplorer}/tx/${hash}`,
        text: 'See transaction',
      },
      timeout: 0,
    });
  };

  const notificateTxSuccess = (hash: Hash, message: string = successMessage) => {
    setNotification({
      type: 'success',
      message,
      link: {
        href: `${blockExplorer}/tx/${hash}`,
        text: 'See transaction',
      },
      timeout: 0,
    });
  };

  const notificateTxError = (error: unknown, message: string = errorMessage) => {
    setNotification({
      type: 'error',
      message: `${message}. Error: ` + (error as GetBlockNumberErrorType)?.name,
      timeout: 0,
    });
  };

  return { notificateTxPending, notificateTxSuccess, notificateTxError };
};
