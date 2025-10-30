const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedTestTournament() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting test tournament seed...\n');

    // Step 1: Create test accounts
    console.log('📝 Creating test accounts...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const testAccounts = [
      { email: 'admin@test.com', username: 'admin_test', role: 'admin', firstName: 'Admin', lastName: 'User' },
      { email: 'player1@test.com', username: 'player1', role: 'player', firstName: 'Alice', lastName: 'Johnson' },
      { email: 'player2@test.com', username: 'player2', role: 'player', firstName: 'Bob', lastName: 'Smith' },
      { email: 'player3@test.com', username: 'player3', role: 'player', firstName: 'Charlie', lastName: 'Brown' },
      { email: 'player4@test.com', username: 'player4', role: 'player', firstName: 'Diana', lastName: 'Wilson' },
      { email: 'player5@test.com', username: 'player5', role: 'player', firstName: 'Eve', lastName: 'Davis' },
      { email: 'player6@test.com', username: 'player6', role: 'player', firstName: 'Frank', lastName: 'Miller' },
      { email: 'player7@test.com', username: 'player7', role: 'player', firstName: 'Grace', lastName: 'Lee' },
      { email: 'player8@test.com', username: 'player8', role: 'player', firstName: 'Henry', lastName: 'Taylor' },
    ];

    const userIds = {};

    for (const account of testAccounts) {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [account.email]
      );

      if (existingUser.rows.length > 0) {
        userIds[account.username] = existingUser.rows[0].id;
        console.log(`   ✓ User ${account.username} already exists`);
      } else {
        const result = await client.query(
          `INSERT INTO users (email, username, password_hash, role, first_name, last_name)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [account.email, account.username, hashedPassword, account.role, account.firstName, account.lastName]
        );
        userIds[account.username] = result.rows[0].id;
        console.log(`   ✓ Created user: ${account.username} (${account.email})`);
      }
    }

    console.log('\n');

    // Step 2: Create tournament
    console.log('🏆 Creating test tournament...');

    const tournamentResult = await client.query(
      `INSERT INTO tournaments (
        name,
        game_system,
        format,
        start_date,
        max_players,
        total_rounds,
        status,
        location,
        description,
        organizer_id,
        current_round
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        'Test Tournament - Multi Round',
        'warmachine',
        'Swiss',
        new Date('2025-11-15T10:00:00Z'),
        16,
        5,
        'active',
        'Test Convention Center',
        'A comprehensive test tournament with multiple rounds for testing all features',
        userIds.admin_test,
        3
      ]
    );

    const tournamentId = tournamentResult.rows[0].id;
    console.log(`   ✓ Created tournament: ${tournamentId}`);
    console.log('\n');

    // Step 3: Register players
    console.log('👥 Registering players...');

    const factions = ['Khador', 'Cygnar', 'Cryx', 'Protectorate', 'Retribution', 'Mercenaries', 'Trollbloods', 'Circle'];
    const playerRegistrations = [];

    for (let i = 1; i <= 8; i++) {
      const result = await client.query(
        `INSERT INTO tournament_players (tournament_id, player_id, faction, list_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [
          tournamentId,
          userIds[`player${i}`],
          factions[i - 1],
          `${factions[i - 1]} Test List`
        ]
      );
      playerRegistrations.push(result.rows[0].id);
      console.log(`   ✓ Registered player${i} with ${factions[i - 1]}`);
    }

    console.log('\n');

    // Step 4: Create Round 1
    console.log('🎲 Creating Round 1...');

    const round1 = await client.query(
      `INSERT INTO rounds (tournament_id, round_number, status)
       VALUES ($1, 1, 'completed')
       RETURNING id`,
      [tournamentId]
    );
    const round1Id = round1.rows[0].id;

    // Round 1 Pairings and Results
    const round1Matches = [
      { player1: 0, player2: 1, winner: 0, cp1: 5, cp2: 2, ap1: 45, ap2: 23 },
      { player1: 2, player2: 3, winner: 2, cp1: 5, cp2: 1, ap1: 48, ap2: 19 },
      { player1: 4, player2: 5, winner: 5, cp1: 3, cp2: 5, ap1: 35, ap2: 50 },
      { player1: 6, player2: 7, winner: 6, cp1: 5, cp2: 4, ap1: 47, ap2: 42 },
    ];

    for (const match of round1Matches) {
      await client.query(
        `INSERT INTO matches (
          round_id,
          tournament_id,
          player1_id,
          player2_id,
          table_number,
          status,
          winner_id,
          player1_control_points,
          player2_control_points,
          player1_army_points,
          player2_army_points
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          round1Id,
          tournamentId,
          playerRegistrations[match.player1],
          playerRegistrations[match.player2],
          round1Matches.indexOf(match) + 1,
          'completed',
          playerRegistrations[match.winner],
          match.cp1,
          match.cp2,
          match.ap1,
          match.ap2
        ]
      );
    }

    console.log(`   ✓ Created 4 matches for Round 1`);
    console.log('\n');

    // Step 5: Create Round 2
    console.log('🎲 Creating Round 2...');

    const round2 = await client.query(
      `INSERT INTO rounds (tournament_id, round_number, status)
       VALUES ($1, 2, 'completed')
       RETURNING id`,
      [tournamentId]
    );
    const round2Id = round2.rows[0].id;

    // Round 2 Pairings (Winners vs Winners, Losers vs Losers)
    const round2Matches = [
      { player1: 0, player2: 2, winner: 0, cp1: 5, cp2: 3, ap1: 49, ap2: 38 },
      { player1: 5, player2: 6, winner: 5, cp1: 5, cp2: 2, ap1: 46, ap2: 28 },
      { player1: 1, player2: 3, winner: 1, cp1: 5, cp2: 4, ap1: 48, ap2: 45 },
      { player1: 4, player2: 7, winner: 7, cp1: 2, cp2: 5, ap1: 25, ap2: 50 },
    ];

    for (const match of round2Matches) {
      await client.query(
        `INSERT INTO matches (
          round_id,
          tournament_id,
          player1_id,
          player2_id,
          table_number,
          status,
          winner_id,
          player1_control_points,
          player2_control_points,
          player1_army_points,
          player2_army_points
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          round2Id,
          tournamentId,
          playerRegistrations[match.player1],
          playerRegistrations[match.player2],
          round2Matches.indexOf(match) + 1,
          'completed',
          playerRegistrations[match.winner],
          match.cp1,
          match.cp2,
          match.ap1,
          match.ap2
        ]
      );
    }

    console.log(`   ✓ Created 4 matches for Round 2`);
    console.log('\n');

    // Step 6: Create Round 3
    console.log('🎲 Creating Round 3...');

    const round3 = await client.query(
      `INSERT INTO rounds (tournament_id, round_number, status)
       VALUES ($1, 3, 'completed')
       RETURNING id`,
      [tournamentId]
    );
    const round3Id = round3.rows[0].id;

    // Round 3 Pairings
    const round3Matches = [
      { player1: 0, player2: 5, winner: 5, cp1: 4, cp2: 5, ap1: 41, ap2: 50 },
      { player1: 2, player2: 1, winner: 2, cp1: 5, cp2: 3, ap1: 47, ap2: 36 },
      { player1: 6, player2: 7, winner: 7, cp1: 3, cp2: 5, ap1: 32, ap2: 48 },
      { player1: 3, player2: 4, winner: 3, cp1: 5, cp2: 4, ap1: 46, ap2: 44 },
    ];

    for (const match of round3Matches) {
      await client.query(
        `INSERT INTO matches (
          round_id,
          tournament_id,
          player1_id,
          player2_id,
          table_number,
          status,
          winner_id,
          player1_control_points,
          player2_control_points,
          player1_army_points,
          player2_army_points
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          round3Id,
          tournamentId,
          playerRegistrations[match.player1],
          playerRegistrations[match.player2],
          round3Matches.indexOf(match) + 1,
          'completed',
          playerRegistrations[match.winner],
          match.cp1,
          match.cp2,
          match.ap1,
          match.ap2
        ]
      );
    }

    console.log(`   ✓ Created 4 matches for Round 3`);
    console.log('\n');

    await client.query('COMMIT');

    console.log('✅ Test tournament seed completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 Test Tournament Summary:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Tournament ID: ${tournamentId}`);
    console.log(`Tournament Name: Test Tournament - Multi Round`);
    console.log(`Status: Active (3 rounds completed)`);
    console.log(`Players: 8 registered`);
    console.log(`Rounds: 3 completed (out of 5 total)`);
    console.log('');
    console.log('🏆 Current Standings (after 3 rounds):');

    // Get standings
    const standings = await pool.query(
      `SELECT
        u.username,
        u.email,
        tp.faction,
        COUNT(CASE WHEN m.winner_id = tp.id THEN 1 END) as wins,
        COUNT(CASE WHEN m.winner_id IS NOT NULL AND m.winner_id != tp.id THEN 1 END) as losses,
        SUM(CASE
          WHEN m.player1_id = tp.id THEN m.player1_control_points
          WHEN m.player2_id = tp.id THEN m.player2_control_points
          ELSE 0
        END) as total_cp,
        SUM(CASE
          WHEN m.player1_id = tp.id THEN m.player1_army_points
          WHEN m.player2_id = tp.id THEN m.player2_army_points
          ELSE 0
        END) as total_ap
      FROM tournament_players tp
      JOIN users u ON tp.player_id = u.id
      LEFT JOIN matches m ON (m.player1_id = tp.id OR m.player2_id = tp.id) AND m.status = 'completed'
      WHERE tp.tournament_id = $1
      GROUP BY tp.id, u.username, u.email, tp.faction
      ORDER BY
        COUNT(CASE WHEN m.winner_id = tp.id THEN 1 END) DESC,
        SUM(CASE
          WHEN m.player1_id = tp.id THEN m.player1_control_points
          WHEN m.player2_id = tp.id THEN m.player2_control_points
          ELSE 0
        END) DESC,
        SUM(CASE
          WHEN m.player1_id = tp.id THEN m.player1_army_points
          WHEN m.player2_id = tp.id THEN m.player2_army_points
          ELSE 0
        END) DESC`,
      [tournamentId]
    );

    standings.rows.forEach((player, index) => {
      console.log(`${index + 1}. ${player.username} (${player.faction}) - ${player.wins}W-${player.losses}L - ${player.total_cp} CP - ${player.total_ap} AP`);
    });

    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding test tournament:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seed
seedTestTournament()
  .then(() => {
    console.log('\n✨ Seed complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
