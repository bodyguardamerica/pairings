require('dotenv').config();
const { pool } = require('./src/config/database');

async function updateRole() {
  // Get email and role from command line arguments
  const email = process.argv[2];
  const role = process.argv[3] || 'admin';

  if (!email) {
    console.log('❌ Usage: node update-role.js <email> [role]');
    console.log('   Roles: player, to, admin');
    console.log('   Example: node update-role.js admin@example.com admin');
    process.exit(1);
  }

  if (!['player', 'to', 'admin'].includes(role)) {
    console.log('❌ Invalid role. Must be: player, to, or admin');
    process.exit(1);
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, username, role',
      [role, email]
    );

    if (result.rows.length > 0) {
      console.log('✅ User role updated successfully:');
      console.log(result.rows[0]);
    } else {
      console.log('❌ User not found with email:', email);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

updateRole();
