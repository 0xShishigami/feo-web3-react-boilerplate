export type TNotificationState = {
  type: 'success' | 'error' | 'loading';
  message: string;
  visible: boolean;
  timeout: number;
};

export type TNotificationPayload = Pick<TNotificationState, 'type' | 'message' | 'timeout'>;

export type TNotificationAction =
  | {
      type: 'SET_NOTIFICATION';
      payload: TNotificationPayload;
    }
  | {
      type: 'CLEAR_NOTIFICATION';
    };
