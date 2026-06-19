const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((line) => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local!'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('Connecting to Supabase at:', supabaseUrl);

  const email = 'test2@gmail.com';
  const password = 'Test@123';
  const userId = 'a8b8c8d8-e8f8-4a8b-8c8d-e8f8a8b8c8d8';

  // 1. Check or create tenant 'chauhan'
  console.log('Checking default tenant "chauhan"...');
  let { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', 'chauhan')
    .maybeSingle();

  if (tenantErr || !tenant) {
    console.log('Tenant "chauhan" not found. Creating tenant...');
    const { data: newTenant, error: createTenantErr } = await supabase
      .from('tenants')
      .insert({
        name: 'Chauhan Solar',
        slug: 'chauhan',
        status: 'active',
      })
      .select('id')
      .maybeSingle();

    if (createTenantErr || !newTenant) {
      console.error('Failed to create default tenant "chauhan":', createTenantErr);
      process.exit(1);
    }
    tenant = newTenant;
    console.log('Tenant "chauhan" created successfully with ID:', tenant.id);
  } else {
    console.log('Tenant "chauhan" exists with ID:', tenant.id);
  }

  // 2. Create or update user in auth.users
  console.log(`Checking if user ${email} exists...`);
  const {
    data: { users },
    error: listUsersErr,
  } = await supabase.auth.admin.listUsers();

  if (listUsersErr) {
    console.error('Failed to list users:', listUsersErr);
    process.exit(1);
  }

  let user = users.find((u) => u.email === email);

  if (!user) {
    console.log(`Creating auth user ${email}...`);
    const { data: newUser, error: createUserErr } = await supabase.auth.admin.createUser({
      id: userId,
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { name: 'Chauhan Admin' },
    });

    if (createUserErr) {
      console.warn('Failed to create auth user with static UUID:', createUserErr.message);
      console.log('Attempting to create user with dynamic UUID...');
      const { data: newUser2, error: createUserErr2 } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { name: 'Chauhan Admin' },
      });
      if (createUserErr2) {
        console.error('Failed to create auth user with dynamic UUID:', createUserErr2);
        process.exit(1);
      }
      user = newUser2.user;
    } else {
      user = newUser.user;
    }
    console.log(`Auth user created successfully! ID: ${user.id}`);
  } else {
    console.log(`User ${email} already exists! Updating password and metadata...`);
    const { error: updateUserErr } = await supabase.auth.admin.updateUserById(user.id, {
      password: password,
      email_confirm: true,
      user_metadata: { name: 'Chauhan Admin' },
    });
    if (updateUserErr) {
      console.error('Failed to update auth user:', updateUserErr);
      process.exit(1);
    }
    console.log('Auth user updated successfully!');
  }

  // 3. Map to public.tenant_users as super_admin
  console.log(`Mapping user ${email} to tenant "chauhan" inside public.tenant_users...`);
  const { error: mapErr } = await supabase.from('tenant_users').upsert(
    {
      tenant_id: tenant.id,
      user_id: user.id,
      role: 'super_admin',
    },
    { onConflict: 'tenant_id,user_id' }
  );

  if (mapErr) {
    console.error('Failed to map user to tenant in public.tenant_users:', mapErr);
    process.exit(1);
  }

  console.log('\n================================================');
  console.log('🎉 SUCCESS: Admin auth credentials seeded! 🎉');
  console.log('Email:    ' + email);
  console.log('Password: ' + password);
  console.log('================================================\n');
}

main().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
