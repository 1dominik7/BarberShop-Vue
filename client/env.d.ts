/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_URL: string
  readonly VITE_UPLOADPRESET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
