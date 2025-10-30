require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://192.168.1.240:3000/api';

// Sample event data
const events = [
  {
    name: 'Winter Warmachine Championship 2025',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Annual winter championship tournament featuring top players from the region',
    location: 'Gaming Haven, Seattle',
    startDate: '2024-12-15T10:00:00Z',
    maxPlayers: 32,
    totalRounds: 5,
    status: 'completed',
  },
  {
    name: 'Spring Steamroller Tournament',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Kick off the spring season with competitive Warmachine action',
    location: 'Emerald City Games, Portland',
    startDate: '2025-03-20T09:00:00Z',
    maxPlayers: 24,
    totalRounds: 4,
    status: 'registration',
  },
  {
    name: 'Autumn Clash 2024',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Fall tournament with prizes for top finishers',
    location: 'The Game Matrix, Tacoma',
    startDate: '2024-10-10T10:00:00Z',
    maxPlayers: 16,
    totalRounds: 4,
    status: 'completed',
  },
  {
    name: 'Mox Boarding House Monthly',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Monthly casual tournament - all skill levels welcome!',
    location: 'Mox Boarding House, Bellevue',
    startDate: '2025-11-05T11:00:00Z',
    maxPlayers: 20,
    totalRounds: 3,
    status: 'active',
  },
  {
    name: 'Summer Smackdown',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Beat the heat with intense Warmachine battles',
    location: 'Card Kingdom, Seattle',
    startDate: '2025-07-12T10:00:00Z',
    maxPlayers: 28,
    totalRounds: 4,
    status: 'registration',
  },
  {
    name: 'New Year Bash Tournament',
    gameSystem: 'warmachine',
    format: 'Steamroller',
    description: 'Start the new year right with a bang! Prizes and fun guaranteed.',
    location: 'Phoenix Games, Olympia',
    startDate: '2025-01-15T10:00:00Z',
    maxPlayers: 16,
    totalRounds: 3,
    status: 'completed',
  },
];

async function createEvents() {
  console.log('🎲 Starting event creation...\n');

  // First, we need to login or register to get a token
  let token;

  try {
    // Register a seeder account
    console.log('🔐 Creating seeder account...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
      email: 'seeder@example.com',
      username: 'seeder',
      password: 'Seeder123',
      firstName: 'Event',
      lastName: 'Seeder',
    });
    token = registerResponse.data.token;
    console.log('✅ Seeder account created\n');
    console.log('⚠️  IMPORTANT: Run this command to make the account admin/TO:');
    console.log('   node update-role.js seeder@example.com to\n');

    // Wait a moment for user to update role
    console.log('Please run the command above in another terminal, then press Enter to continue...');
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });
  } catch (error) {
    // Account might already exist, try to login
    console.log('⚠️  Seeder account already exists, trying to login...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        login: 'seeder@example.com',
        password: 'Seeder123',
      });
      token = loginResponse.data.token;
      console.log('✅ Logged in successfully\n');
    } catch (loginError) {
      console.error('❌ Failed to login:', loginError.response?.data || loginError.message);
      console.error('\n💡 Please ensure the seeder account has TO or Admin role:');
      console.error('   node update-role.js seeder@example.com to');
      return;
    }
  }

  // Create each event
  let created = 0;
  let failed = 0;

  for (const event of events) {
    try {
      console.log(`📝 Creating event: ${event.name}`);
      const response = await axios.post(
        `${API_BASE}/tournaments`,
        {
          ...event,
          settings: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`   ✅ Created successfully (ID: ${response.data.tournament.id})`);
      console.log(`   📍 Location: ${event.location}`);
      console.log(`   📅 Date: ${new Date(event.startDate).toLocaleDateString()}`);
      console.log(`   🎮 Players: ${event.maxPlayers} max`);
      console.log(`   📊 Status: ${event.status}\n`);

      created++;

      // If status should be completed or active, we'd need to update it
      // For now, events are created in 'draft' status by default
      if (event.status !== 'draft') {
        try {
          await axios.put(
            `${API_BASE}/tournaments/${response.data.tournament.id}`,
            { status: event.status },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`   ✅ Updated status to: ${event.status}\n`);
        } catch (updateError) {
          console.log(`   ⚠️  Could not update status (this is okay)\n`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Failed to create: ${error.response?.data?.message || error.message}\n`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${created} events`);
  console.log(`❌ Failed: ${failed} events`);
  console.log('='.repeat(50));

  if (created > 0) {
    console.log('\n🎉 Events are now available in the app!');
    console.log('   Visit http://localhost:8081 to see them');
  }
}

createEvents().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
