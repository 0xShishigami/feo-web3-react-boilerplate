import { createContext, useReducer } from 'react';

import { TNotificationAction, TNotificationState } from './types';
import { reducer } from './reducer';

export * from './types';
export * from './actions';

export interface TNotificationContext {
  state: TNotificationState;
  dispatchNotification: React.Dispatch<TNotificationAction>;
}

export const initialState: TNotificationState = {
  type: 'success',
  message: '',
  visible: false,
  timeout: 0,
};

export const NotificationContext = createContext<TNotificationContext>({
  state: initialState,
  dispatchNotification: () => {},
});

export const NotificationProvider = ({
  children,
  defaultValues = initialState,
}: {
  children: React.ReactNode;
  defaultValues?: TNotificationState;
}) => {
  const [state, dispatch] = useReducer(reducer, defaultValues);

  return (
    <NotificationContext.Provider
      value={{
        state,
        dispatchNotification: dispatch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
