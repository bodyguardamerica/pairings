require('dotenv').config();
const { pool } = require('./src/config/database');

async function markMigration() {
  const client = await pool.connect();

  try {
    console.log('Marking migration 003 as executed...');

    await client.query(
      'INSERT INTO migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING',
      ['003_add_co_organizers.sql']
    );

    console.log('✅ Migration 003 marked as executed');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

markMigration();
