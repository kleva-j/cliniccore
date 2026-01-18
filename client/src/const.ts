export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Supabase Environment Variables
// These are loaded from VITE_* environment variables at build time
export const ENV = {
  publicSupabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? '',
  publicSupabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  publicAppUrl: import.meta.env.VITE_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : ''),
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// Supabase OAuth configuration
export const getSupabaseOAuthUrl = (provider: 'google' | 'github') => {
  const redirectTo = `${ENV.publicAppUrl}/auth/callback`;
  const url = new URL(`https://${ENV.publicSupabaseUrl}/auth/v1/authorize`);
  url.searchParams.set("provider", provider);
  url.searchParams.set("redirect_to", redirectTo);
  return url.toString();
};
