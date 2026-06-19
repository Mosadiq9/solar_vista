const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  console.log('Testing SELECT on tenants using ANON key...');
  const { data: tenants, error: tErr } = await supabase
    .from('tenants')
    .select('*, tenant_settings(*)')
    .eq('status', 'active');
  console.log('--- TENANTS WITH SETTINGS ---');
  console.log(JSON.stringify(tenants, null, 2));
  console.log('Error:', tErr);
}

main();
