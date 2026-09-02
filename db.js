import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://lplnlmbbiznwffsdzwml.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwbG5sbWJiaXpud2Zmc2R6d21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTY4NjcsImV4cCI6MjEwMzkzMjg2N30.EG1QkCXpj64At7Jj8I6fro5a7-u3WBWcyo39mKgNf1E';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getPaymentMethods() {
  const { data, error } = await supabase.from('payment_methods').select('*').order('display_order', { ascending: true });
  if (error) {
    console.error('Error fetching from Supabase:', error.message);
    return [];
  }
  return data;
}

export default supabase;
