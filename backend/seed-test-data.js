const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// Test accounts
const accounts = [
  { email: 'alice@example.com', username: 'alice', password: 'Password123!', firstName: 'Alice', lastName: 'Anderson' },
  { email: 'bob@example.com', username: 'bob', password: 'Password123!', firstName: 'Bob', lastName: 'Baker' },
  { email: 'charlie@example.com', username: 'charlie', password: 'Password123!', firstName: 'Charlie', lastName: 'Clark' },
  { email: 'diana@example.com', username: 'diana', password: 'Password123!', firstName: 'Diana', lastName: 'Davis' },
  { email: 'evan@example.com', username: 'evan', password: 'Password123!', firstName: 'Evan', lastName: 'Evans' },
  { email: 'frank@example.com', username: 'frank', password: 'Password123!', firstName: 'Frank', lastName: 'Foster' },
  { email: 'grace@example.com', username: 'grace', password: 'Password123!', firstName: 'Grace', lastName: 'Garcia' },
  { email: 'henry@example.com', username: 'henry', password: 'Password123!', firstName: 'Henry', lastName: 'Harris' },
];

// Factions for variety
const factions = [
  'Cygnar',
  'Khador',
  'Protectorate of Menoth',
  'Cryx',
  'Retribution of Scyrah',
  'Convergence of Cyriss',
  'Mercenaries',
  'Circle Orboros',
];

// List names
const listNames = [
  'Storm Division',
  'Winter Guard',
  'Faithful Crusaders',
  'Nightmare Legion',
  'Retribution Force',
  'Clockwork Army',
  'Hired Guns',
  'Wild Hunt',
];

const events = [
  {
    name: 'Seattle Spring Steamroller 2025',
    city: 'Seattle',
    venue: 'Mox Boarding House Ballard',
    startDate: '2025-03-15',
    maxPlayers: 16,
    totalRounds: 4,
    description: 'Spring season opener for the Seattle meta',
    status: 'registration',
    playerCount: 8,
  },
  {
    name: 'Tacoma Summer Showdown',
    city: 'Tacoma',
    venue: 'Olympic Cards & Comics',
    startDate: '2025-06-20',
    maxPlayers: 24,
    totalRounds: 5,
    description: 'Summer tournament with prizes for top 3',
    status: 'registration',
    playerCount: 6,
  },
  {
    name: 'Portland Winter Championship',
    city: 'Portland',
    venue: 'Guardian Games',
    startDate: '2025-01-10',
    maxPlayers: 32,
    totalRounds: 5,
    description: 'Major championship event',
    status: 'active',
    playerCount: 12,
  },
  {
    name: 'Bellevue Casual Tournament',
    city: 'Bellevue',
    venue: 'Card Kingdom',
    startDate: '2025-04-05',
    maxPlayers: 12,
    totalRounds: 3,
    description: 'Casual friendly tournament',
    status: 'registration',
    playerCount: 4,
  },
];

async function createAccount(account) {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, account);
    console.log(`✅ Created account: ${account.username}`);
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 409) {
      // Account exists, try to login
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        login: account.username,
        password: account.password,
      });
      console.log(`ℹ️  Account exists, logged in: ${account.username}`);
      return loginResponse.data.token;
    }
    throw error;
  }
}

async function createEvent(token, eventData) {
  try {
    const response = await axios.post(
      `${API_BASE}/tournaments`,
      {
        name: eventData.name,
        gameSystem: 'warmachine',
        format: 'Steamroller',
        description: eventData.description,
        location: `${eventData.venue}, ${eventData.city}`,
        startDate: `${eventData.startDate}T10:00:00Z`,
        maxPlayers: eventData.maxPlayers,
        totalRounds: eventData.totalRounds,
        settings: {},
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Created event: ${eventData.name}`);
    return response.data.tournament;
  } catch (error) {
    console.error(`❌ Failed to create event ${eventData.name}:`, error.response?.data?.message || error.message);
    throw error;
  }
}

async function registerPlayer(token, tournamentId, factionIndex, listIndex) {
  try {
    await axios.post(
      `${API_BASE}/tournaments/${tournamentId}/register`,
      {
        listName: listNames[listIndex % listNames.length],
        faction: factions[factionIndex % factions.length],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.error(`❌ Failed to register player:`, error.response?.data?.message || error.message);
    return false;
  }
}

async function updateTournamentStatus(token, tournamentId, status) {
  try {
    await axios.put(
      `${API_BASE}/tournaments/${tournamentId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(`✅ Updated tournament status to: ${status}`);
  } catch (error) {
    console.error(`❌ Failed to update status:`, error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('🚀 Starting test data generation...\n');

  // Create all player accounts
  console.log('📝 Creating player accounts...');
  const tokens = [];
  for (const account of accounts) {
    const token = await createAccount(account);
    tokens.push(token);
  }

  console.log('\n🎯 Creating events and registering players...\n');

  // Create organizer account
  const organizerToken = tokens[0]; // Alice will be the organizer

  for (let i = 0; i < events.length; i++) {
    const eventData = events[i];
    console.log(`\n--- Creating: ${eventData.name} ---`);

    // Create event
    const tournament = await createEvent(organizerToken, eventData);

    // Update status if needed
    if (eventData.status === 'registration' || eventData.status === 'active') {
      await updateTournamentStatus(organizerToken, tournament.id, 'registration');
    }

    // Register players (skip organizer, start from index 1)
    const playersToRegister = eventData.playerCount;
    console.log(`Registering ${playersToRegister} players...`);

    for (let p = 1; p <= playersToRegister && p < tokens.length; p++) {
      const registered = await registerPlayer(
        tokens[p],
        tournament.id,
        p, // faction index
        p  // list name index
      );
      if (registered) {
        console.log(`  ✅ Registered ${accounts[p].username}`);
      }
    }

    // Update to active if needed
    if (eventData.status === 'active') {
      await updateTournamentStatus(organizerToken, tournament.id, 'active');
    }

    console.log(`✅ Completed: ${eventData.name}`);
  }

  console.log('\n\n🎉 Test data generation complete!');
  console.log('\n📊 Summary:');
  console.log(`   - Created ${accounts.length} player accounts`);
  console.log(`   - Created ${events.length} events`);
  console.log(`   - Total registrations: ${events.reduce((sum, e) => sum + e.playerCount, 0)}`);
  console.log('\n🔐 Test Account Credentials:');
  console.log('   Email: alice@example.com, bob@example.com, charlie@example.com, etc.');
  console.log('   Password: Password123! (for all accounts)');
  console.log('\n💡 Tip: You can now login as any of these users to test the system!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
