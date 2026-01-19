/**
 * Client-side Supabase client for browser use
 * Uses @supabase/ssr for proper session handling
 */

import { createBrowserClient } from '@supabase/ssr';
import { ENV } from '@/const';

export function createClient() {
  return createBrowserClient(
    ENV.publicSupabaseUrl,
    ENV.publicSupabaseAnonKey
  );
}

export const supabase = createClient();

