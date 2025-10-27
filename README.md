<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Ldp8I4cDQiiKPmtL1bPhT82Mk412hc6L

## Run Locally

**Prerequisites:**  Node.js and a Supabase account


1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up Supabase (see [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed instructions):
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create a `.env` file in the project root with your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Run the database migration in your Supabase SQL Editor (copy from `supabase/database.sql`)

3. (Optional) Set the `GEMINI_API_KEY` in `.env` if you need AI features

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

## Supabase Integration

This app uses Supabase for persistent data storage. All data is stored in your Supabase database instead of localStorage. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed setup instructions.
