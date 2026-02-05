import { createClient } from '@supabase/supabase-js';

// Access environment variables directly. 
// The vite-env.d.ts file ensures import.meta.env is typed correctly.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables. The app will fail to fetch data.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
