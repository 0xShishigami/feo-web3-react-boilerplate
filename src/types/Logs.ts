import { Log } from 'viem';
import { TokenData } from '~/types/Token';

export type EventLogs = Log & { tokenData: TokenData } & (
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
