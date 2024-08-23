import { Reducer } from 'react';
import { initialState } from './NotificationProvider';
import { TNotificationAction, TNotificationState } from './types';
import { NotificationActionTypes } from './actions';

export const reducer: Reducer<TNotificationState, TNotificationAction> = (state, action) => {
  switch (action.type) {
    case NotificationActionTypes.SET_NOTIFICATION:
      return {
        ...state,
        ...action.payload,
        visible: true,
      };
    case NotificationActionTypes.CLEAR_NOTIFICATION:
      return initialState;
    default:
      return state;
  }
};
