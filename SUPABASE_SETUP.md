# Supabase Setup Guide

This project uses Supabase for backend data storage. Follow these steps to set up your Supabase instance.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password (save it!)
   - Region: Choose the closest region to your users
5. Wait for the project to be created (usually takes 1-2 minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click on "Settings" in the sidebar
2. Go to "API" section
3. Copy the following values:
   - **Project URL**: Under "Project URL"
   - **Anon public key**: Under "Project API keys" → "anon" "public"

## 3. Create Environment Variables

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add the following lines with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-url-here` with your Project URL
- `your-anon-key-here` with your anon public key

**Important:** The `.env` file is in `.gitignore` to keep your credentials secure.

## 4. Create the Database Tables

1. In your Supabase dashboard, click on "SQL Editor" in the sidebar
2. Click "New Query"
3. Open the file `supabase/database.sql` from this project
4. Copy the entire contents of the file
5. Paste it into the SQL Editor
6. Click "Run" to execute the SQL

This will create all the necessary tables with the correct schema.

## 5. Configure Row Level Security (RLS)

The provided SQL script creates permissive policies that allow all operations. For production, you should:

1. Go to "Authentication" → "Policies" in Supabase dashboard
2. Review and update the RLS policies based on your security requirements
3. Consider implementing authentication to restrict access to authorized users only

## 6. Start Your App

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the URL shown (usually `http://localhost:3000`)

## Testing the Setup

After setup, your app should:
- Load data from Supabase instead of localStorage
- Persist all changes to the database
- Work with real-time updates if configured

## Troubleshooting

### "Supabase credentials not found" Warning
- Make sure your `.env` file exists in the project root
- Check that the variable names are exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your development server after creating/modifying the `.env` file

### Database Query Errors
- Make sure you ran the SQL migration (`supabase/database.sql`)
- Check the Supabase dashboard for any errors in the SQL logs
- Verify that all tables were created successfully

### CORS Errors
- Supabase should handle CORS automatically
- Check that your Project URL is correct
- Make sure you're using the anon key (not the service role key) in the client

## Migration from localStorage

The app has been updated to use Supabase by default. Any existing localStorage data will not be automatically migrated. To migrate existing data:

1. Export your localStorage data
2. Use the Supabase dashboard or create a migration script to import the data
3. Or manually add data through the app UI

## Next Steps

- Consider adding authentication for user management
- Set up Supabase Storage for better photo management
- Configure real-time subscriptions for live updates
- Set up proper RLS policies for production
- Implement backup strategies for your data

