import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://lplnlmbbiznwffsdzwml.supabase.co';

const supabaseAnonKey = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwbG5sbWJiaXpud2Zmc2R6d21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTY4NjcsImV4cCI6MjEwMzkzMjg2N30.EG1QkCXpj64At7Jj8I6fro5a7-u3WBWcyo39mKgNf1E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
