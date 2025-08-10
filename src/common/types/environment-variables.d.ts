export interface EnvironmentVariables {
  // General
  PORT: number;

  // GitHub
  S_GITHUB_CLIENT_ID: string;
  S_GITHUB_CLIENT_SECRET: string;
  S_GITHUB_CALLBACK_URL: string;

  // JWT
  JWT_SECRET: string;

  // DB
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  // Encryption
  ENCRYPTION_PASSWORD: string;
}
