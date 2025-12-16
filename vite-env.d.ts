/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ELEVENLABS_AGENT_ID: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_STRIPE_TRIAL_LINK: string;
  readonly VITE_STRIPE_STARTER_LINK: string;
  readonly VITE_STRIPE_GROWTH_LINK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
