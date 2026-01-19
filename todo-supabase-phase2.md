# Supabase Migration - Phase 2: Backend Authentication Migration

## Phase 2 Status: IN PROGRESS 🚧

## Overview

Phase 2 implements the backend Supabase client and updates authentication logic to use Supabase Auth instead of the custom OAuth system.

## Phase 2 Tasks

### 2.1 Install Supabase Packages
- [ ] 2.1.1 Install @supabase/supabase-js on server
- [ ] 2.1.2 Install @supabase/ssr for server-side auth
- [ ] 2.1.3 Install @supabase/supabase-js on client

### 2.2 Create Server-Side Supabase Client
- [ ] 2.2.1 Create `server/_core/supabase.ts` with auth helpers
- [ ] 2.2.2 Implement session validation functions
- [ ] 2.2.3 Add cookie-based session handling

### 2.3 Update Environment Configuration
- [ ] 2.3.1 Update `server/_core/env.ts` with Supabase env vars
- [ ] 2.3.2 Ensure env vars are properly loaded

### 2.4 Update Context Creation
- [ ] 2.4.1 Modify `server/_core/context.ts` for Supabase auth
- [ ] 2.4.2 Implement user lookup by Supabase ID
- [ ] 2.4.3 Add backward compatibility for legacy openId

### 2.5 Update DB Functions
- [ ] 2.5.1 Add `getUserBySupabaseId()` function
- [ ] 2.5.2 Add `linkUserSupabaseId()` function
- [ ] 2.5.3 Add `createUserFromSupabase()` function

### 2.6 Update Authentication Router
- [ ] 2.6.1 Replace login procedure with Supabase Auth
- [ ] 2.6.2 Replace register procedure with Supabase Auth
- [ ] 2.6.3 Add OAuth provider login
- [ ] 2.6.4 Update logout procedure
- [ ] 2.6.5 Add password reset procedures

### 2.7 Create Auth Callback Handler
- [ ] 2.7.1 Create `server/authCallback.ts` for OAuth callbacks
- [ ] 2.7.2 Register callback routes

## Files to Create
- `server/_core/supabase.ts` - Server-side Supabase client
- `server/authCallback.ts` - OAuth callback handler

## Files to Modify
- `server/_core/env.ts` - Add Supabase env vars
- `server/_core/context.ts` - Update auth logic
- `server/db.ts` - Add Supabase-related functions
- `server/routers.ts` - Update auth procedures

## Phase 2 Status: IN PROGRESS

