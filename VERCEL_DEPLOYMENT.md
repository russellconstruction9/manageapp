# Vercel Deployment Setup

## Fixed Issues ✅

1. **File extension fix**: Renamed `hooks/useAuth.ts` to `hooks/useAuth.tsx` to support JSX syntax
2. **Environment variables**: Updated `supabase/config.ts` to use environment variables

## Required Environment Variables

Set these in your Vercel project settings:

### Supabase Configuration
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Current Values (for reference):
```
VITE_SUPABASE_URL=https://ohuwypfbomkqwtzjzpws.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ sparabaseLIsInJlZiI6Im9odXd5cGZib21rcXd0emp6cHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjA2NzQsImV4cCI6MjA3NzA5NjY3NH0.jwN2MpJese_Lr1XSjDXuMox_Yloyw0jf9MubqYjOILY
```

## How to Deploy to Vercel

### Step 1: Add Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - Key: `VITE_SUPABASE_URL`
     Value: `https://ohuwypfbomkqwtzjzpws.supabase.co`
   - Key: `VITE_SUPABASE_ANON_KEY`
     Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXd5cGZib21rcXd0emp6cHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjA2NzQsImV4cCI6MjA3NzA5NjY3NH0.jwN2MpJese_Lr1XSjDXuMox_Yloyw0jf9MubqYjOILY`
4. Make sure to select all environments (Production, Preview, Development)
5. Click **Save**

### Step 2: Deploy

1. Commit and push the latest changes:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment - update Supabase config to use env vars"
   git push
   ```

2. Vercel will automatically detect the push and trigger a new deployment

### Step 3: Verify

1. Go to your Vercel deployment page
2. Check the build logs to ensure it completes successfully
3. Test the deployed app

## Local Development

For local development, you can create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://ohuwypfbomkqwtzjzpws.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXd5cGZib21rcXd0emp6cHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjA2NzQsImV4cCI6MjA3NzA5NjY3NH0.jwN2MpJese_Lr1XSjDXuMox_Yloyw0jf9MubqYjOILY
```

Note: The `.env.local` file is gitignored for security.

## Build Verification

The build was tested locally and completes successfully:

```bash
npm run build
```

Output:
```
✓ 457 modules transformed.
✓ built in 3.21s
```

## Troubleshooting

If deployment still fails:

1. **Check environment variables**: Ensure all required env vars are set in Vercel
2. **Check build logs**: Look for specific error messages in Vercel deployment logs
3. **Redeploy**: After adding env vars, trigger a new deployment
4. **Node version**: Ensure Vercel is using Node.js 18+ (should be automatic)

## Important Notes

⚠️ **Security**: The Supabase URL and anon key are safe to expose in the frontend - they're meant to be public. However, never commit the service role key.

✅ **Fallback values**: The config includes hardcoded fallback values for easier local development, but Vercel will use the environment variables you set.

