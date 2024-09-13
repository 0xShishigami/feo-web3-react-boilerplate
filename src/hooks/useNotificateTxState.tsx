import { GetBlockNumberErrorType, Hash } from 'viem';
import { useAccount } from 'wagmi';
import { useSetNotification } from '~/hooks/useNotification';

type NotificationTxStateArgs =
  | {
      type: 'loading';
      hash: Hash;
      message?: string;
    }
  | {
      type: 'success';
      hash: Hash;
      message?: string;
    }
  | {
      type: 'error';
      message?: string;
      error?: unknown;
    };

const pendingMessage = 'Pending Transaction',
  successMessage = 'Transaction successful',
  errorMessage = 'Error while processing transaction';

const defaultBlockExplorer = '';

export const useNotificateTxState = () => {
  const setNotification = useSetNotification();
  const { chain } = useAccount();

  const blockExplorer = chain?.blockExplorers?.default.url || defaultBlockExplorer;

  const notificateTx = (args: NotificationTxStateArgs) => {
    let notificationMessage = args.message;
    let link;

    switch (args.type) {
      case 'loading':
        notificationMessage = args.message || pendingMessage;
        link = {
          href: `${blockExplorer}/tx/${args.hash}`,
          text: 'See transaction',
        };
        break;
      case 'success':
        notificationMessage = args.message || successMessage;
        link = {
          href: `${blockExplorer}/tx/${args.hash}`,
          text: 'See transaction',
        };
        break;
      case 'error':
        notificationMessage =
          `${args.message || errorMessage}. Error: ` + (args.error as GetBlockNumberErrorType)?.name;
        break;
    }

    setNotification({
      type: args.type,
      message: notificationMessage,
      link,
      timeout: 0,
    });
  };

  return notificateTx;
};
