require('dotenv').config();
const { pool } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  console.log('🔄 Running migration 003_add_co_organizers...\n');

  try {
    const migrationPath = path.join(__dirname, 'database', 'migrations', '003_add_co_organizers.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await pool.query(sql);

    console.log('✅ Migration 003_add_co_organizers completed successfully!\n');
    console.log('   - Added co_organizers JSONB field to tournaments table');
    console.log('   - Created GIN index for co_organizers queries\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
