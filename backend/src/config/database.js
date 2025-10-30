const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const dns = require('dns');

// Force Node.js to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

// Supabase client for auth and realtime features
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

// Supabase admin client for backend operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// PostgreSQL connection pool for direct database queries
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
  // Force IPv4
  options: '-c search_path=public'
});

// Validate configuration
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  process.exit(1);
}
if (!process.env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL is not set in environment variables');
  process.exit(1);
}

// Debug connection string (mask password)
if (process.env.DATABASE_URL) {
  const maskedString = process.env.DATABASE_URL.replace(/:[^@]+@/, ':****@');
  console.log('📊 Database connection string:', maskedString);
}

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully');
    console.log('📅 Database time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  await pool.end();
  console.log('Database pool closed');
};

module.exports = {
  supabase,
  supabaseAdmin,
  pool,
  testConnection,
  closePool
};
