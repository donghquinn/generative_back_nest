declare global {
  namespace NodeJs {
    interface ProcessEnv {
      APP_PORT: string;
      NODE_ENV: string;

      CHATGPT_API_TOKEN2: string;
      CHATGPT_API_URL: string;

      SESSION_SECRET: string;

      RPC_URL: string;
    }
  }
}
