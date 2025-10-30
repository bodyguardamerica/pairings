require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function listUsers() {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, created_at FROM users ORDER BY created_at DESC LIMIT 10'
    );

    console.log('\n📋 Recent Users:\n');
    console.log('Email                    | Username       | Role    | Created');
    console.log('─'.repeat(70));

    result.rows.forEach(user => {
      const email = user.email.padEnd(25);
      const username = user.username.padEnd(15);
      const role = user.role.padEnd(8);
      const created = new Date(user.created_at).toLocaleDateString();
      console.log(`${email}| ${username}| ${role}| ${created}`);
    });

    console.log('\n');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

listUsers();
