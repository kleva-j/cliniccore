export const ENV = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",

  // Forge API Configuration (for LLM, notifications, etc.)
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",

  // Supabase Configuration
  supabaseUrl: process.env.PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  publicAppUrl: process.env.PUBLIC_APP_URL ?? "http://localhost:5173",
};
