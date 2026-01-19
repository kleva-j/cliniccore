/**
 * Server-side Supabase integration
 * Uses @supabase/ssr for proper server-side authentication
 */

import type { User, Session } from "@supabase/supabase-js";
import type { Request, Response } from "express";

import {
  serializeCookieHeader,
  createServerClient,
  parseCookieHeader,
} from "@supabase/ssr";

import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { ENV } from "./env";

// Type for Express Request with cookies
interface ExpressRequest extends Request {
  cookies: Record<string, string>;
}

// Type for Express Response with cookie methods
interface ExpressResponse extends Response {
  append: (field: string, value: string) => this;
}

/**
 * Create a Supabase client for the current request
 * Handles cookie serialization automatically
 */
export function createSupabaseClient(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");

  return createServerClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies;
      },
      setAll(cookiesToSet) {
        for (const { name, value, ...options } of cookiesToSet) {
          res.append("Set-Cookie", serializeCookieHeader(name, value, options));
        }
      },
    },
  });
}

/**
 * Get the current session from the request
 */
export async function getSession(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<{
  user: User | null;
  session: Session | null;
}> {
  if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
    console.warn("[Supabase] Not configured");
    return { user: null, session: null };
  }

  try {
    const supabase = createSupabaseClient(req, res);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("[Supabase] Session error:", error.message);
      return { user: null, session: null };
    }

    return { user: session?.user ?? null, session };
  } catch (error) {
    console.error("[Supabase] Get session error:", error);
    return { user: null, session: null };
  }
}

/**
 * Get the current user from the request
 */
export async function getUser(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<User | null> {
  const { user } = await getSession(req, res);
  return user;
}

/**
 * Sign in with email and password
 */
export async function signInWithPassword(
  req: ExpressRequest,
  res: ExpressResponse,
  email: string,
  password: string
): Promise<{ user: User; session: Session }> {
  const supabase = createSupabaseClient(req, res);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[Supabase] Sign in error:", error.message);
    throw error;
  }

  if (!data.user || !data.session) {
    throw new Error("Sign in failed: No user or session returned");
  }

  return { user: data.user, session: data.session };
}

/**
 * Sign up with email and password
 */
export async function signUp(
  req: ExpressRequest,
  res: ExpressResponse,
  email: string,
  password: string,
  options?: {
    data?: Record<string, unknown>;
    redirectTo?: string;
  }
): Promise<{ user: User; session: Session }> {
  const supabase = createSupabaseClient(req, res);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: options?.data,
      emailRedirectTo: options?.redirectTo,
    },
  });

  if (error) {
    console.error("[Supabase] Sign up error:", error.message);
    throw error;
  }

  if (!data.user) {
    throw new Error("Sign up failed: No user returned");
  }

  if (!data.session) {
    throw new Error("Sign up failed: No session returned");
  }

  return { user: data.user, session: data.session };
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(
  req: ExpressRequest,
  res: ExpressResponse,
  provider: "google" | "github" | "apple",
  options?: {
    redirectTo?: string;
    scopes?: string;
  }
): Promise<{ url: string }> {
  const supabase = createSupabaseClient(req, res);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: options?.redirectTo ?? `${ENV.publicAppUrl}/auth/callback`,
      scopes: options?.scopes,
    },
  });

  if (error) {
    console.error("[Supabase] OAuth sign in error:", error.message);
    throw error;
  }

  if (!data.url) {
    throw new Error("OAuth sign in failed: No URL returned");
  }

  return { url: data.url };
}

/**
 * Exchange authorization code for session
 * Used in OAuth callback
 */
export async function exchangeCodeForSession(
  req: ExpressRequest,
  res: ExpressResponse,
  code: string
): Promise<void> {
  const supabase = createSupabaseClient(req, res);
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[Supabase] Exchange code error:", error.message);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<void> {
  const supabase = createSupabaseClient(req, res);
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[Supabase] Sign out error:", error.message);
    // Don't throw on sign out errors
  }
}

/**
 * Reset password for email
 */
export async function resetPasswordForEmail(
  req: ExpressRequest,
  res: ExpressResponse,
  email: string,
  options?: {
    redirectTo?: string;
  }
): Promise<void> {
  const supabase = createSupabaseClient(req, res);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: options?.redirectTo ?? `${ENV.publicAppUrl}/reset-password`,
  });

  if (error) {
    console.error("[Supabase] Reset password error:", error.message);
    throw error;
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  req: ExpressRequest,
  res: ExpressResponse,
  newPassword: string
): Promise<void> {
  const supabase = createSupabaseClient(req, res);
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("[Supabase] Update password error:", error.message);
    throw error;
  }
}

/**
 * Get user identity claims (for JWT verification)
 */
export async function getUserIdentity(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<User | null> {
  return getUser(req, res);
}

/**
 * Create a new user in the app database from Supabase user data
 * Called when a Supabase user doesn't exist in the local database
 */
export async function createUserFromSupabase(supabaseUser: User) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Determine login method from user metadata
  const loginMethod = supabaseUser.app_metadata?.provider
    ? supabaseUser.app_metadata.provider
    : "email";

  const result = await db
    .insert(users)
    .values({
      supabaseId: supabaseUser.id,
      email: supabaseUser.email ?? null,
      name:
        supabaseUser.user_metadata?.full_name ??
        supabaseUser.user_metadata?.name ??
        null,
      loginMethod,
      role: "patient", // Default role for new users
      lastSignedIn: new Date(),
    })
    .returning();

  console.log(`[Supabase] Created new user: ${supabaseUser.email}`);
  return result[0];
}

/**
 * Link an existing user to a Supabase ID
 * Called during migration from legacy auth
 */
export async function linkUserToSupabase(
  userId: number,
  supabaseId: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .update(users)
    .set({
      supabaseId,
      lastSignedIn: new Date(),
    })
    .where(eq(users.id, userId));

  console.log(`[Supabase] Linked user ${userId} to Supabase ID ${supabaseId}`);
}

/**
 * Verify and refresh session if needed
 */
export async function verifyAndRefreshSession(
  req: ExpressRequest,
  res: ExpressResponse
): Promise<{ user: User | null; refreshed: boolean }> {
  const { user, session } = await getSession(req, res);

  if (!session || !user) {
    return { user: null, refreshed: false };
  }

  // Check if session is expired or about to expire (within 5 minutes)
  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiresAt > 0 && expiresAt - now < fiveMinutes) {
    // Session is about to expire, try to refresh
    try {
      const supabase = createSupabaseClient(req, res);
      const {
        data: { session: newSession },
      } = await supabase.auth.refreshSession();
      return { user: newSession?.user ?? null, refreshed: true };
    } catch (error) {
      console.error("[Supabase] Session refresh error:", error);
      return { user: null, refreshed: false };
    }
  }

  return { user, refreshed: false };
}
