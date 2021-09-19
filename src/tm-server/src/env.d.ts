declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    FRONTEND_URL: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
    AWS_BUCKET_REGION: string;
  }
}