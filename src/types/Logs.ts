import { Log } from 'viem';

export type EventLogs = Log &
  (
    | {
        eventName: 'Transfer';
        args: {
          from: string;
          to: string;
          value: string;
        };
      }
    | {
        eventName: 'Approval';
        args: {
          owner: string;
          spender: string;
          value: string;
        };
      }
  );
