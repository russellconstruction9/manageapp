import { createClient } from '@supabase/supabase-js';

// Use your Supabase project credentials
const supabaseUrl = 'https://ohuwypfbomkqwtzjzpws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odXd5cGZib21rcXd0emp6cHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjA2NzQsImV4cCI6MjA3NzA5NjY3NH0.jwN2MpJese_Lr1XSjDXuMox_Yloyw0jf9MubqYjOILY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
