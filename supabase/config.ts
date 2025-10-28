import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ohuwypfbomkqwtzjzpws.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXd5cGZib21rcXd0emp6cHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjA2NzQsImV4cCI6MjA3NzA5NjY3NH0.jwN2MpJese_Lr1XSjDXuMox_Yloyw0jf9MubqYjOILY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
