# Supabase Setup Guide

This guide walks you through setting up Supabase for ClinicCore authentication and storage.

## Prerequisites

- A Supabase account (free tier is sufficient to start)
- Access to Google Cloud Console (for Google OAuth)
- Access to GitHub Developer Settings (for GitHub OAuth, optional)

---

## Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `cliniccore` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait for project initialization (1-2 minutes)

## Step 2: Get API Credentials

After project is created:

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon public** key → `PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

## Step 3: Configure Authentication Providers

### Email/Password (Enabled by Default)

1. Go to **Authentication** → **Providers**
2. Confirm **Email** provider is enabled
3. Optionally configure:
   - Min password length
   - Confirm email requirement

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: `http://localhost:5173` (development)
   - **Authorized redirect URIs**: 
     - `http://localhost:5173/auth/callback`
     - `https://your-domain.com/auth/callback`
3. Copy Client ID and Client Secret
4. In Supabase:
   - Go to **Authentication** → **Providers**
   - Click **Google**
   - Enable the provider
   - Enter Client ID and Client Secret
   - Add scopes: `email`, `profile`

### GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App:
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `http://localhost:5173/auth/callback`
3. Copy Client ID and generate Client Secret
4. In Supabase:
   - Go to **Authentication** → **Providers**
   - Click **GitHub**
   - Enable the provider
   - Enter Client ID and Client Secret

## Step 4: Configure URL Settings

1. Go to **Project Settings** → **API**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:5173/auth/callback
   https://your-production-domain.com/auth/c_callback
   ```

## Step 5: Set Up Database Schema

Run the following SQL in Supabase's SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
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

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    'patient'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 6: Set Up Storage

1. Go to **Storage** in Supabase sidebar
2. Click **New Bucket**
3. Create bucket with settings:
   - **Name**: `clinic-documents`
   - **Public bucket**: Yes
4. Add RLS policies:
   - **Authenticated uploads**: Allow
   - **User file access**: Based on folder ownership

## Step 7: Add Environment Variables

Create `.env` file in project root:

```env
# Supabase
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
PUBLIC_APP_URL=http://localhost:5173

# Existing config
DATABASE_URL=postgresql://...
```

## Step 8: Test the Configuration

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open browser console (F12)
3. Test Supabase connection:
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   )
   console.log('Supabase client initialized')
   ```

4. Test auth flow at `/login`

## Troubleshooting

### OAuth Redirect URL Issues
- Ensure redirect URLs match exactly in both Supabase and OAuth provider
- Don't forget trailing slashes

### CORS Errors
- Add your domain to Supabase's allowed origins in Project Settings → API

### RLS Policy Denials
- Check policy syntax in Supabase SQL Editor
- Test policies with `supabase.auth.getSession()` to see user context

## Next Steps

After setup is complete:
1. Proceed to Phase 2: Database Schema Migration
2. Update `todo-supabase-phase1.md` to mark as complete
3. Move to Phase 2 implementation

## Security Best Practices

- Never commit `.env` files to version control
- Use service role key only on server-side
- Regularly rotate API keys if needed
- Review RLS policies before going to production

