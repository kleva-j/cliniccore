export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Supabase Environment Variables
// These are loaded from VITE_* environment variables at build time
export const ENV = {
  publicSupabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  publicSupabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  publicAppUrl:
    import.meta.env.VITE_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : ""),
};

// Get the login URL for staff authentication
// Uses Supabase OAuth flow
export const getLoginUrl = () => {
  const redirectUri = `${window.location.origin}/auth/callback`;
  return redirectUri;
};

// Supabase OAuth configuration - returns the redirect URL for OAuth providers
// The actual OAuth flow is handled by the Supabase client
export const getSupabaseOAuthUrl = (provider: "google" | "github") => {
  const redirectTo = `${ENV.publicAppUrl}/auth/callback`;
  // The Supabase client handles the actual URL generation
  return null; // Return null to indicate client-side handling
};
