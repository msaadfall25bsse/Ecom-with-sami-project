import { supabase } from '../utils/supabaseClient.js';

async function testSupabase() {
  console.log('🔄 Testing Supabase Live Database Connection...\n');
  
  try {
    const { data: methods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Supabase Query Error:', error.message);
      process.exit(1);
    }

    console.log('✅ SUPABASE CONNECTION SUCCESSFUL!');
    console.log(`📦 Found ${methods?.length || 0} Payment Methods in Supabase Database:`);
    methods?.forEach(m => {
      console.log(`  - [${m.method_key}] ${m.title} (${m.account_title} - ${m.account_number || m.iban_or_wallet})`);
    });

  } catch (err: any) {
    console.error('❌ Connection Failed:', err.message);
  }
}

testSupabase();
