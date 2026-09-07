/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Client-safe environment variables only
  readonly BASE_URL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
