# Deploying ClinicCore to Vercel

This guide walks you through deploying the ClinicCore application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a database with one of these providers:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended for Vercel integration)
   - [Neon](https://neon.tech) (serverless Postgres with generous free tier)
   - [Supabase](https://supabase.com) (includes auth and storage features)
   - [Railway](https://railway.app) or [AWS RDS](https://aws.amazon.com/rds/)
3. **Environment Variables**: Prepare all required values (see below)

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository (GitHub, GitLab, or Bitbucket)
   - Vercel will auto-detect settings from `vercel.json`

2. **Configure Environment Variables**:
   Click "Environment Variables" and add:
   
   **Required**:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NODE_ENV=production
   ```
   
   **OAuth (if using authentication)**:
   ```
   OAUTH_CLIENT_ID=your_oauth_client_id
   OAUTH_CLIENT_SECRET=your_oauth_client_secret
   OAUTH_REDIRECT_URI=https://your-domain.vercel.app/api/oauth/callback
   ```
   
   **AWS S3 (if using file uploads)**:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your_bucket_name
   ```
   
   **Other** (application-specific):
   ```
   OWNER_OPEN_ID=your_admin_user_id
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://cliniccore.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # From project root
   vercel
   
   # For production deployment
   vercel --prod
   ```

4. **Add Environment Variables**:
   ```bash
   # Add variables one by one
   vercel env add DATABASE_URL production
   
   # Or use the dashboard: vercel.com/[your-project]/settings/environment-variables
   ```

## Database Setup

After deploying, you need to run database migrations:

1. **Set DATABASE_URL locally** (for one-time migration):
   ```bash
   # Create .env.production file
   echo "DATABASE_URL=your_production_database_url" > .env.production
   ```

2. **Run migrations**:
   ```bash
   # Load production env and run migration
   $env:DATABASE_URL="your_production_database_url"; pnpm db:push
   ```

   Or on Unix/Mac:
   ```bash
   DATABASE_URL=your_production_database_url pnpm db:push
   ```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update OAuth redirect URIs if using authentication

## CI/CD Setup

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Configuration

The deployment is configured via `vercel.json`:
- **Build Command**: `pnpm build` (runs Vite + esbuild)
- **Output Directory**: `dist/public` (frontend assets)
- **API Routes**: `/api/*` handled by serverless function
- **Routing**: SPA routing for client-side navigation

## Verification Steps

After deployment:

1. **Check Deployment Status**:
   - View build logs in Vercel dashboard
   - Ensure no errors occurred

2. **Test Application**:
   - Visit your deployed URL
   - Check browser console for errors
   - Test navigation between pages

3. **Verify API**:
   - Test tRPC endpoints by using the app
   - Verify database connectivity
   - Check authentication flow

4. **Monitor Performance**:
   - Check Vercel Analytics
   - Monitor serverless function logs
   - Watch for cold start delays

## Troubleshooting

### Build Fails

**Error: Build command failed**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure TypeScript compiles locally: `pnpm check`

**Error: Module not found**
- Verify imports use correct paths
- Check that all dependencies are installed
- Review `tsconfig.json` path aliases

### Database Connection Issues

**Error: Cannot connect to database**
- Verify `DATABASE_URL` environment variable is set
- Check database is accessible from internet
- Ensure connection string format is correct:
  ```
  postgresql://user:password@host:port/database?sslmode=require
  ```

**Error: SSL/TLS required**
- Add `?sslmode=require` or `?ssl=true` to DATABASE_URL
- For Neon: Use connection string from dashboard
- For Vercel Postgres: Use `POSTGRES_URL` environment variable

### Runtime Errors

**Error: 500 Internal Server Error**
- Check Vercel function logs: `vercel logs`
- Verify environment variables are set correctly
- Check database migrations have been run

**Error: Cold start timeout**
- Serverless functions may timeout on first request
- Consider Vercel Pro for faster cold starts
- Optimize database queries

### Static Files Not Loading

**Error: 404 on assets**
- Verify build completed successfully
- Check `dist/public` directory exists after build
- Review `vercel.json` routing configuration

## Performance Optimization

1. **Enable Vercel Analytics**:
   - Go to project settings
   - Enable Web Analytics
   - Monitor Core Web Vitals

2. **Optimize Bundle Size**:
   ```bash
   # Analyze bundle
   pnpm build
   # Check dist/public for large files
   ```

3. **Database Connection Pooling**:
   - Use connection pooling for serverless (e.g., Neon, Supabase)
   - Consider using Prisma Data Proxy for heavy traffic

4. **Caching**:
   - Static assets are automatically cached by Vercel CDN
   - Configure API response caching if needed

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | Yes | Set to "production" |
| `OAUTH_CLIENT_ID` | If using OAuth | OAuth provider client ID |
| `OAUTH_CLIENT_SECRET` | If using OAuth | OAuth provider secret |
| `OAUTH_REDIRECT_URI` | If using OAuth | OAuth callback URL |
| `AWS_ACCESS_KEY_ID` | If using S3 | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | If using S3 | AWS secret key |
| `AWS_REGION` | If using S3 | AWS region |
| `AWS_S3_BUCKET` | If using S3 | S3 bucket name |
| `OWNER_OPEN_ID` | Optional | Admin user identifier |

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel PostgreSQL Docs](https://vercel.com/docs/storage/vercel-postgres)
- [tRPC Deployment Guide](https://trpc.io/docs/deployment)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)

## Rollback

If you need to rollback to a previous version:

1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```
