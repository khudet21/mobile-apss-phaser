/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly VITE_API_URL: string
  // Tambahkan variabel lain jika diperlukan
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
