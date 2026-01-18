# Supabase Migration Plan for ClinicCore

## Executive Summary

This document outlines the step-by-step migration from the current custom OAuth and storage system to **Supabase** for authentication and file storage. The migration will leverage Supabase Auth for user management and Supabase Storage for file handling.

---

## Phase 1: Supabase Setup & Configuration

### 1.1 Create Supabase Project
- [ ] Create new Supabase project at [supabase.com](https://supabase.com)
- [ ] Note down project URL and anon key
- [ ] Enable required auth providers:
  - [ ] Email/Password
  - [ ] Google OAuth
  - [ ] GitHub OAuth (optional)
  - [ ] Apple OAuth (optional)
- [ ] Configure OAuth redirect URLs in Supabase dashboard

### 1.2 Environment Variables Update
Update `.env` file with Supabase credentials:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Remove old OAuth variables (to be deprecated)
# OAUTH_SERVER_URL=
# VITE_APP_ID=
# JWT_SECRET=
# BUILT_IN_FORGE_API_URL=
# BUILT_IN_FORGE_API_KEY=
```

---

## Phase 2: Database Schema Migration

### 2.1 Update Existing Tables for Supabase Integration

**Current State:**
- `users` table uses custom `openId` as identifier
- `patientAccounts` stores email/password with SHA-256 hash
- `doctors`, `patients` link to users via integer foreign keys

**Target State:**
```sql
-- Add Supabase UUID to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add email_confirmed_at to users for better UX
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmed_at TIMESTAMP WITH TIME ZONE;

-- Update patientAccounts to reference auth.users instead of local password hash
-- (passwords will be managed by Supabase Auth)
```

### 2.2 Supabase Schema Setup

Run this in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (public user info linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('admin', 'receptionist', 'doctor', 'patient')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    'patient'  -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for clinic documents
INSERT INTO storage.buckets (id, name, public) VALUES ('clinic-documents', 'clinic-documents', true);

-- RLS policies for storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can upload to clinic-documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'clinic-documents' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view own files in clinic-documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'clinic-documents' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR owner = auth.uid())
  );

CREATE POLICY "Users can update own files in clinic-documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'clinic-documents' AND owner = auth.uid()
  );
```

---

## Phase 3: Backend Authentication Migration

### 3.1 Install Supabase Server SDK

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 3.2 Create Supabase Client

Create `server/_core/supabase.ts`:

```typescript
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import type { User, Session } from '@supabase/supabase-js';
import type { TrpcContext } from './context';

export function createSupabaseClient(req: Request, res?: Response) {
  return createServerClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          if (res) {
            res.headers.append('Set-Cookie', serializeCookieHeader(cookiesToSet));
          }
        },
      },
    }
  );
}

export async function getSession(req: Request): Promise<{ user: User | null; session: Session | null }> {
  const supabase = createSupabaseClient(req);
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('[Supabase] Session error:', error.message);
    return { user: null, session: null };
  }
  
  return { user: session?.user ?? null, session };
}

export async function getUser(req: Request): Promise<User | null> {
  const { user } = await getSession(req);
  return user;
}

export async function validateSession(req: Request): Promise<User | null> {
  const { user, session } = await getSession(req);
  
  if (!session || !user) {
    return null;
  }
  
  // Check if session is expired
  if (session.expires_at && session.expires_at < Date.now() / 1000) {
    return null;
  }
  
  return user;
}
```

### 3.3 Update Environment Configuration

Update `server/_core/env.ts`:

```typescript
export const ENV = {
  // ... existing variables ...
  
  // Supabase
  supabaseUrl: process.env.PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  
  // ... other variables ...
};
```

### 3.4 Update Context Creation

Update `server/_core/context.ts`:

```typescript
import type { TrpcContext } from './context';
import { getUser } from './supabase';
import type { User as AppUser } from '../../drizzle/schema';
import { getUserBySupabaseId, getUserByOpenId } from '../db';
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: AppUser | null = null;

  try {
    // Try to get user from Supabase session first
    const supabaseUser = await getUser(opts.req);
    
    if (supabaseUser) {
      // Try to find user by Supabase ID
      user = await getUserBySupabaseId(supabaseUser.id);
      
      if (!user) {
        // Try legacy openId for backward compatibility during migration
        const legacyUser = await getUserByOpenId(supabaseUser.id);
        if (legacyUser) {
          // Link the legacy user to Supabase ID
          await linkUserToSupabase(legacyUser.id, supabaseUser.id);
          user = { ...legacyUser, supabase_id: supabaseUser.id };
        } else {
          // Create new user from Supabase data
          user = await createUserFromSupabase(supabaseUser);
        }
      }
    }
  } catch (error) {
    console.error('[Context] Authentication error:', error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

// Helper functions to be implemented in db.ts
async function getUserBySupabaseId(supabaseId: string): Promise<AppUser | null> {
  // Query users table by supabase_id column
}

async function linkUserToSupabase(userId: number, supabaseId: string): Promise<void> {
  // Update user record with supabase_id
}

async function createUserFromSupabase(supabaseUser: any): Promise<AppUser> {
  // Create new user record from Supabase user data
}
```

### 3.5 Update DB Functions

Update `server/db.ts` with new functions:

```typescript
// New function: Get user by Supabase ID
export async function getUserBySupabaseId(supabaseId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const { users } = await import("../drizzle/schema");
  const result = await db.select().from(users).where(eq(users.supabaseId, supabaseId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// New function: Link legacy user to Supabase
export async function linkUserSupabaseId(userId: number, supabaseId: string) {
  const db = await getDb();
  if (!db) return;
  const { users } = await import("../drizzle/schema");
  await db.update(users).set({ supabaseId }).where(eq(users.id, userId));
}

// New function: Create user from Supabase
export async function createUserFromSupabase(supabaseUser: { id: string; email?: string; user_metadata?: { full_name?: string } }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { users } = await import("../drizzle/schema");
  
  const result = await db.insert(users).values({
    supabaseId: supabaseUser.id,
    email: supabaseUser.email ?? null,
    name: supabaseUser.user_metadata?.full_name ?? null,
    role: 'patient',
    loginMethod: 'oauth',  // or determine from provider
  }).returning();
  
  return result[0];
}
```

### 3.6 Update Authentication Router

Update `server/routers.ts` auth section:

```typescript
import { createSupabaseClient } from './_core/supabase';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(async ({ ctx }) => {
      // Return current user info
      return ctx.user;
    }),
    
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const supabase = createSupabaseClient(ctx.req, ctx.res);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

        if (error) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: error.message,
          });
        }

        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      }),
    
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(8),
          fullName: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const supabase = createSupabaseClient(ctx.req, ctx.res);
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              full_name: input.fullName,
            },
          },
        });

        if (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        return {
          success: true,
          user: data.user,
          session: data.session,
        };
      }),
    
    loginWithOAuth: publicProcedure
      .input(
        z.object({
          provider: z.enum(['google', 'github', 'apple']),
          redirectTo: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const supabase = createSupabaseClient(ctx.req, ctx.res);
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: input.provider,
          options: {
            redirectTo: input.redirectTo || `${process.env.PUBLIC_APP_URL}/api/auth/callback`,
            skipBrowserRedirect: true, // Return URL for manual redirect
          },
        });

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        return { url: data.url };
      }),
    
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const supabase = createSupabaseClient(ctx.req, ctx.res);
      await supabase.auth.signOut();
      return { success: true };
    }),
    
    resetPassword: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input, ctx }) => {
        const supabase = createSupabaseClient(ctx.req, ctx.res);
        const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
          redirectTo: `${process.env.PUBLIC_APP_URL}/reset-password`,
        });

        if (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }

        return { success: true };
      }),
    
    updatePassword: publicProcedure
      .input(z.object({ newPassword: z.string().min(8) }))
      .mutation(async ({ input, ctx }) => {
        const supabase = createSupabaseClient(ctx.req, ctx.res);
        const { error } = await supabase.auth.updateUser({
          password: input.newPassword,
        });

        if (error) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: error.message,
          });
        }

        return { success: true };
      }),
  }),
  
  // ... rest of routers
});
```

### 3.7 OAuth Callback Handler

Create `server/authCallback.ts`:

```typescript
import type { Express, Request, Response } from 'express';
import { createSupabaseClient } from './_core/supabase';

export function registerAuthCallbackRoutes(app: Express) {
  app.get('/api/auth/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const next = req.query.next as string | undefined;

    if (!code) {
      res.status(400).json({ error: 'Authorization code missing' });
      return;
    }

    try {
      const supabase = createSupabaseClient(req, res);
      
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('[Auth Callback] Error:', error.message);
        res.status(500).json({ error: 'Authentication failed' });
        return;
      }

      // Redirect to app or specified next page
      res.redirect(302, next || '/');
    } catch (error) {
      console.error('[Auth Callback] Exception:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });
}
```

---

## Phase 4: Storage Migration

### 4.1 Create Supabase Storage Client

Create `server/_core/supabaseStorage.ts`:

```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { UploadResult, DownloadResult } from './types/storageTypes';

// Server-side storage client with service role
let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      process.env.PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdmin;
}

export async function storageUpload(
  bucket: string,
  path: string,
  file: Buffer | Uint8Array | string,
  contentType: string = 'application/octet-stream'
): Promise<UploadResult> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    key: data.path,
    url: urlData.publicUrl,
  };
}

export async function storageGetDownloadUrl(
  bucket: string,
  path: string
): Promise<string> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    throw new Error(`Failed to get download URL: ${error.message}`);
  }

  return data.signedUrl;
}

export async function storageDelete(
  bucket: string,
  paths: string[]
): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove(paths);

  if (error) {
    throw new Error(`Failed to delete files: ${error.message}`);
  }
}

export async function storageList(
  bucket: string,
  folderPath: string
): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folderPath);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data.map(item => item.name);
}
```

### 4.2 Update Storage API Router

Add to `server/routers.ts`:

```typescript
import { storageUpload, storageGetDownloadUrl, storageDelete } from './_core/supabaseStorage';

export const appRouter = router({
  // ... existing routers
  
  storage: router({
    upload: protectedProcedure
      .input(
        z.object({
          file: z.string(), // Base64 encoded file
          fileName: z.string(),
          contentType: z.string(),
          folder: z.string().default('uploads'),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Check user permissions
        if (!['admin', 'receptionist', 'doctor'].includes(ctx.user.role)) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient permissions' });
        }

        const buffer = Buffer.from(input.file, 'base64');
        const filePath = `${input.folder}/${Date.now()}-${input.fileName}`;
        
        const result = await storageUpload('clinic-documents', filePath, buffer, input.contentType);
        
        return result;
      }),
    
    getDownloadUrl: protectedProcedure
      .input(
        z.object({
          fileKey: z.string(),
          expiresIn: z.number().default(3600),
        })
      )
      .query(async ({ input }) => {
        const url = await storageGetDownloadUrl('clinic-documents', input.fileKey);
        return { url };
      }),
    
    delete: protectedProcedure
      .input(
        z.object({
          fileKeys: z.array(z.string()),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin only' });
        }

        await storageDelete('clinic-documents', input.fileKeys);
        return { success: true };
      }),
  }),
});
```

---

## Phase 5: Client-Side Migration

### 5.1 Install Supabase Client

```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 5.2 Create Supabase Client

Create `client/src/lib/supabase.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  return createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
};

export const supabase = createClient();
```

### 5.3 Update Environment Variables

Create/update `.env`:

```env
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_APP_URL=http://localhost:5173
```

Update `client/src/const.ts`:

```typescript
export const ENV = {
  // ... existing
  publicSupabaseUrl: import.meta.env.PUBLIC_SUPABASE_URL ?? '',
  publicSupabaseAnonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '',
};
```

### 5.4 Update Auth Hook

Update `client/src/_core/hooks/useAuth.ts`:

```typescript
import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getLoginUrl } from '@/const';

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } = options ?? {};
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;
    return data;
  }, []);

  const loginWithOAuth = useCallback(async (provider: 'google' | 'github' | 'apple') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === 'undefined') return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    loginWithOAuth,
    logout,
    resetPassword,
    refresh: () => supabase.auth.getSession(),
  };
}
```

### 5.5 Update Storage Functions

Create `client/src/lib/storage.ts`:

```typescript
import { supabase } from './supabase';

export async function uploadFile(
  file: File,
  folder: string = 'uploads'
): Promise<{ key: string; url: string }> {
  const filePath = `${folder}/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('clinic-documents')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('clinic-documents')
    .getPublicUrl(data.path);

  return {
    key: data.path,
    url: urlData.publicUrl,
  };
}

export async function getDownloadUrl(key: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('clinic-documents')
    .createSignedUrl(key, 3600);

  if (error) {
    throw new Error(`Failed to get download URL: ${error.message}`);
  }

  return data.signedUrl;
}

export async function deleteFile(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from('clinic-documents')
    .remove([key]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

export function useFileUrl(key: string | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;

    getDownloadUrl(key).then(setUrl).catch(console.error);
  }, [key]);

  return url;
}
```

---

## Phase 6: Data Migration Strategy

### 6.1 Migrate Existing Users

Create migration script `scripts/migrate-users-to-supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import postgres from 'postgres';
import 'dotenv/config';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const db = postgres(process.env.DATABASE_URL!);

async function migrateUsers() {
  console.log('Starting user migration...');
  
  // Fetch all existing users
  const users = await db.select().from('users');
  
  for (const user of users) {
    try {
      // Skip if already has supabase_id
      if (user.supabaseId) continue;
      
      // Create Supabase user for each existing user
      // Note: We can't migrate passwords directly, users will need to reset
      const { data: supabaseUser, error } = await supabase.auth.admin.createUser({
        email: user.email,
        email_confirm: true,
        user_metadata: {
          full_name: user.name,
          original_openId: user.openId,
          migrated_at: new Date().toISOString(),
        },
      });
      
      if (error) {
        console.error(`Failed to migrate user ${user.email}:`, error);
        continue;
      }
      
      // Update local users table with supabase_id
      await db`
        UPDATE users 
        SET supabase_id = ${supabaseUser.user.id}
        WHERE id = ${user.id}
      `;
      
      console.log(`Migrated user: ${user.email}`);
    } catch (err) {
      console.error(`Error migrating user ${user.email}:`, err);
    }
  }
  
  console.log('User migration complete!');
}

async function migratePatientPasswords() {
  console.log('Migrating patient passwords...');
  
  const accounts = await db.select().from('patientAccounts');
  
  for (const account of accounts) {
    try {
      // Get the user for this account
      const [user] = await db`
        SELECT * FROM users WHERE id = ${account.userId}
      `;
      
      if (!user || !user.supabaseId) {
        console.log(`Skipping account ${account.email} - user not migrated`);
        continue;
      }
      
      // Note: SHA-256 hashed passwords cannot be directly migrated
      // Patients will need to use "Forgot Password" flow
      console.log(`Patient ${account.email} marked for password reset`);
    } catch (err) {
      console.error(`Error processing account ${account.email}:`, err);
    }
  }
  
  console.log('Patient password migration note complete');
}

migrateUsers()
  .then(() => migratePatientPasswords())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
```

Run migration:
```bash
npx tsx scripts/migrate-users-to-supabase.ts
```

### 6.2 Migrate Storage Files

```typescript
// scripts/migrate-storage.ts
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fetch existing files from old storage and upload to Supabase
async function migrateStorageFiles() {
  console.log('Starting storage migration...');
  
  // This depends on your current storage implementation
  // You'll need to list files from your old storage provider
  // and upload them to Supabase Storage
  
  const oldStorageUrl = process.env.BUILT_IN_FORGE_API_URL;
  const oldStorageKey = process.env.BUILT_IN_FORGE_API_KEY;
  
  // Example: List and migrate files
  const filesToMigrate = [
    // Add file paths to migrate
  ];
  
  for (const filePath of filesToMigrate) {
    try {
      // Download from old storage
      const response = await fetch(`${oldStorageUrl}/v1/storage/downloadUrl?path=${filePath}`, {
        headers: { Authorization: `Bearer ${oldStorageKey}` },
      });
      const { url } = await response.json();
      const fileResponse = await fetch(url);
      const buffer = await fileResponse.arrayBuffer();
      
      // Upload to Supabase
      const fileName = path.basename(filePath);
      const { error } = await supabase.storage
        .from('clinic-documents')
        .upload(filePath, buffer, {
          contentType: fileResponse.headers.get('content-type') || 'application/octet-stream',
        });
      
      if (error) {
        console.error(`Failed to upload ${filePath}:`, error);
      } else {
        console.log(`Migrated: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error migrating ${filePath}:`, err);
    }
  }
  
  console.log('Storage migration complete!');
}
```

---

## Phase 7: Cleanup & Testing

### 7.1 Remove Legacy Code

After successful migration, remove:
- `server/_core/oauth.ts` (old OAuth routes)
- `server/_core/sdk.ts` (old SDK)
- `server/storage.ts` (old storage implementation)
- `patientAccounts` table (passwords now in Supabase Auth)
- Old environment variables

### 7.2 Testing Checklist

- [ ] Login with email/password
- [ ] Login with OAuth providers
- [ ] Registration flow
- [ ] Password reset flow
- [ ] Session persistence across page refreshes
- [ ] Logout functionality
- [ ] File upload to Supabase Storage
- [ ] File download with signed URLs
- [ ] File deletion
- [ ] Role-based access control still works
- [ ] tRPC procedures work with new auth
- [ ] Patient portal access

### 7.3 Rollback Plan

Keep backup of:
- Database before migration
- Old OAuth server access
- Old storage API credentials

To rollback:
1. Restore database from backup
2. Revert environment variables
3. Re-enable old auth routes
4. DNS or load balancer can redirect during rollback

---

## Implementation Timeline

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1 | Supabase Setup & Config | 1-2 hours |
| 2 | Database Schema Migration | 2-3 hours |
| 3 | Backend Auth Migration | 4-6 hours |
| 4 | Storage Migration | 2-3 hours |
| 5 | Client-Side Migration | 3-4 hours |
| 6 | Data Migration | 2-4 hours |
| 7 | Testing & Cleanup | 2-3 hours |

**Total Estimated Time: 16-25 hours**

---

## Risk Mitigation

1. **Downtime**: Plan migration during low-traffic period
2. **Data Loss**: Take full database backup before migration
3. **User Access**: Send advance notice to users about potential password reset
4. **Rollback**: Test rollback procedure before starting
5. **Partial Migration**: Can run hybrid mode during transition period

---

## Next Steps

1. Review and approve this plan
2. Create Supabase project and get credentials
3. Set up staging environment for testing
4. Begin Phase 1: Supabase Setup

