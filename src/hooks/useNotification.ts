import { useContext } from 'react';
import { NotificationContext, TNotificationPayload } from '~/providers';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};

export const useSetNotification = () => {
  const { dispatchNotification } = useNotificationContext();

  return (payload: TNotificationPayload) => {
    dispatchNotification({
      type: 'SET_NOTIFICATION',
      payload,
    });
  };
};
