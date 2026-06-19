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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: tenants, error: tErr } = await supabase.from('tenants').select('*');
  console.log('--- ALL TENANTS ---');
  console.log(tenants, tErr);

  const { data: settings, error: sErr } = await supabase.from('tenant_settings').select('*');
  console.log('--- ALL SETTINGS ---');
  console.log(settings, sErr);

  const { data: tenantUsers, error: tuErr } = await supabase.from('tenant_users').select('*');
  console.log('--- ALL TENANT USERS ---');
  console.log(tenantUsers, tuErr);
}

main();
