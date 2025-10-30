require('dotenv').config();
const { supabaseAdmin } = require('../src/config/database');

async function runSupabaseMigrations() {
  console.log('🔄 Starting Supabase migrations using Admin API...\n');

  try {
    // Migration 1: Create users table using raw SQL via Supabase
    console.log('▶️  Creating users table...');

    // Note: Supabase has built-in auth.users table, but we'll create our own for app-specific data
    const { data: usersTable, error: usersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'to', 'admin')),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          avatar_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
        CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
        CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
        CREATE TRIGGER update_users_updated_at
            BEFORE UPDATE ON public.users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (usersError && !usersError.message.includes('already exists')) {
      console.log('⚠️  Note: Direct SQL execution via RPC may not be available.');
      console.log('   Using Supabase SQL Editor instead...\n');
      console.log('📋 Please run the SQL migrations manually in Supabase dashboard:');
      console.log('   1. Go to SQL Editor in Supabase dashboard');
      console.log('   2. Run the SQL files from database/migrations/');
      console.log('   3. Files to run in order:');
      console.log('      - 001_create_users.sql');
      console.log('      - 002_create_tournaments.sql\n');
      return;
    }

    console.log('✅ Users table created!\n');

    // Check if we can query the table
    const { data: checkData, error: checkError } = await supabaseAdmin
      .from('users')
      .select('count');

    if (!checkError) {
      console.log('✅ Database connection working via Supabase API!');
    }

    console.log('\n✅ Migration setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   Run migrations manually in Supabase SQL Editor');
    console.log('   Or use Supabase client API for all database operations');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Alternative: Use Supabase Dashboard SQL Editor');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Click "SQL Editor" in sidebar');
    console.log('   4. Paste and run SQL from migration files\n');
  }
}

runSupabaseMigrations();
