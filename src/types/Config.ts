export interface Env {
  RPC_URL: string;
  PROJECT_ID: string;
  ALCHEMY_KEY: string;
  TEST_MODE: boolean;
}

export interface Constants {
  // ...
}

export interface Config extends Env, Constants {}
