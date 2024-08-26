export type TNotificationState = {
  type: 'success' | 'error' | 'loading';
  message: string;
  visible: boolean;
  timeout: number;
  link?: {
    href: string;
    text: string;
  };
};

export type TNotificationPayload = Pick<TNotificationState, 'type' | 'message' | 'timeout' | 'link'>;

export type TNotificationAction =
  | {
      type: 'SET_NOTIFICATION';
      payload: TNotificationPayload;
    }
  | {
      type: 'CLEAR_NOTIFICATION';
    };
