import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

import { getUserBySupabaseId, getUserByOpenId } from "../db";
import { ENV } from "./env";
import {
  getUser as getSupabaseUser,
  createUserFromSupabase,
  linkUserToSupabase,
} from "./supabase";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  // Check if Supabase is configured
  if (ENV.supabaseUrl && ENV.supabaseAnonKey) {
    try {
      const supabaseUser = await getSupabaseUser(opts.req, opts.res);

      if (supabaseUser) {
        // Try to find user by Supabase ID
        let appUser = await getUserBySupabaseId(supabaseUser.id);

        if (!appUser) {
          // Try legacy openId for backward compatibility during migration
          const legacyUser = await getUserByOpenId(supabaseUser.id);
          if (legacyUser) {
            // Link the legacy user to Supabase ID
            await linkUserToSupabase(legacyUser.id, supabaseUser.id);
            appUser = { ...legacyUser, supabaseId: supabaseUser.id };
          } else {
            // Create new user from Supabase data
            appUser = await createUserFromSupabase(supabaseUser);
          }
        }

        user = appUser;
      }
    } catch (error) {
      console.error("[Context] Supabase authentication error:", error);
      user = null;
    }
  } else {
    // No authentication configured
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
