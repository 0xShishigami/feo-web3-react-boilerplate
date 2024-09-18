import { Address } from 'viem';

export interface Env {
  RPC_URL: string;
  PROJECT_ID: string;
  ALCHEMY_KEY: string;
  TEST_MODE: boolean;
}

export interface Constants {
  USER_TEST_ADDRESS: Address;
}

export interface Config extends Env, Constants {}
