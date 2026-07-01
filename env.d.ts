/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AUTH_LOGIN_URL: string;
  readonly VITE_AUTH_USER_URL: string;
  readonly VITE_AUTH_REFRESH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
