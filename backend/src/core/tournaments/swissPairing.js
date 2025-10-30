/**
 * Swiss Pairing Algorithm (Game-Agnostic)
 * Implements standard Swiss pairing rules
 */

/**
 * Generate pairings for a Swiss round
 * @param {Array} players - Tournament players with their current standings
 * @param {Array} previousMatches - All previous matches to avoid repeat pairings
 * @param {number} roundNumber - Current round number
 * @returns {Array} Array of pairings
 */
function generateSwissPairings(players, previousMatches, roundNumber) {
  // Filter out dropped players
  const activePlayers = players.filter(p => !p.dropped);

  // First round: random pairings
  if (roundNumber === 1) {
    return generateRandomPairings(activePlayers);
  }

  // Subsequent rounds: Swiss pairings by record
  return generateRecordBasedPairings(activePlayers, previousMatches);
}

/**
 * Generate random pairings for first round
 */
function generateRandomPairings(players) {
  // Shuffle players
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const pairings = [];
  let tableNumber = 1;

  // Pair adjacent players
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      // Normal pairing
      pairings.push({
        tableNumber: tableNumber++,
        player1_id: shuffled[i].id,
        player2_id: shuffled[i + 1].id,
        is_bye: false
      });
    } else {
      // Odd player gets bye
      pairings.push({
        tableNumber: tableNumber++,
        player1_id: shuffled[i].id,
        player2_id: null,
        is_bye: true
      });
    }
  }

  return pairings;
}

/**
 * Generate pairings based on current record (Swiss system)
 */
function generateRecordBasedPairings(players, previousMatches) {
  // Build opponent history for each player
  const opponentHistory = buildOpponentHistory(previousMatches);

  // Group players by their score (wins)
  const scoreGroups = groupPlayersByScore(players);

  const pairings = [];
  const paired = new Set();
  let tableNumber = 1;

  // Process each score group from highest to lowest
  const sortedScores = Object.keys(scoreGroups)
    .map(Number)
    .sort((a, b) => b - a);

  for (const score of sortedScores) {
    const group = scoreGroups[score].filter(p => !paired.has(p.id));

    // Pair within this score group
    const groupPairings = pairWithinGroup(
      group,
      opponentHistory,
      paired,
      tableNumber
    );

    pairings.push(...groupPairings);
    tableNumber += groupPairings.length;
  }

  // Handle any unpaired player (give them a bye)
  const allPlayers = players.filter(p => !paired.has(p.id));
  if (allPlayers.length > 0) {
    // Give bye to lowest-rated unpaired player who hasn't had a bye
    const byeCandidate = allPlayers
      .filter(p => !hasHadBye(p.id, previousMatches))
      .sort((a, b) => (a.wins || 0) - (b.wins || 0))[0] || allPlayers[0];

    pairings.push({
      tableNumber: tableNumber++,
      player1_id: byeCandidate.id,
      player2_id: null,
      is_bye: true
    });
  }

  return pairings;
}

/**
 * Pair players within a score group
 */
function pairWithinGroup(group, opponentHistory, paired, startingTableNumber) {
  const pairings = [];
  const available = [...group];
  let tableNumber = startingTableNumber;

  while (available.length >= 2) {
    const player1 = available.shift();
    paired.add(player1.id);

    // Find best opponent who hasn't played player1
    const opponents = opponentHistory.get(player1.id) || new Set();
    const opponent = available.find(p => !opponents.has(p.id));

    if (opponent) {
      // Found valid pairing
      available.splice(available.indexOf(opponent), 1);
      paired.add(opponent.id);

      pairings.push({
        tableNumber: tableNumber++,
        player1_id: player1.id,
        player2_id: opponent.id,
        is_bye: false
      });
    } else {
      // No valid opponent in this group
      // Will be handled in next iteration or given bye
      paired.delete(player1.id);
      break;
    }
  }

  return pairings;
}

/**
 * Build opponent history map
 */
function buildOpponentHistory(matches) {
  const history = new Map();

  matches.forEach(match => {
    if (match.status === 'completed' && !match.is_bye) {
      // Add player2 to player1's opponents
      if (!history.has(match.player1_id)) {
        history.set(match.player1_id, new Set());
      }
      history.get(match.player1_id).add(match.player2_id);

      // Add player1 to player2's opponents
      if (!history.has(match.player2_id)) {
        history.set(match.player2_id, new Set());
      }
      history.get(match.player2_id).add(match.player1_id);
    }
  });

  return history;
}

/**
 * Group players by their score
 */
function groupPlayersByScore(players) {
  const groups = {};

  players.forEach(player => {
    const score = player.wins || 0;
    if (!groups[score]) {
      groups[score] = [];
    }
    groups[score].push(player);
  });

  return groups;
}

/**
 * Check if player has had a bye
 */
function hasHadBye(playerId, matches) {
  return matches.some(
    match =>
      match.is_bye &&
      (match.player1_id === playerId || match.player2_id === playerId)
  );
}

/**
 * Validate pairings
 */
function validatePairings(pairings, players, previousMatches) {
  const errors = [];
  const opponentHistory = buildOpponentHistory(previousMatches);
  const pairedPlayers = new Set();

  pairings.forEach((pairing, index) => {
    // Check for duplicate pairings
    if (pairedPlayers.has(pairing.player1_id)) {
      errors.push(`Player ${pairing.player1_id} is paired multiple times`);
    }
    pairedPlayers.add(pairing.player1_id);

    if (pairing.player2_id) {
      if (pairedPlayers.has(pairing.player2_id)) {
        errors.push(`Player ${pairing.player2_id} is paired multiple times`);
      }
      pairedPlayers.add(pairing.player2_id);

      // Check for repeat pairings
      const p1Opponents = opponentHistory.get(pairing.player1_id) || new Set();
      if (p1Opponents.has(pairing.player2_id)) {
        errors.push(
          `Players ${pairing.player1_id} and ${pairing.player2_id} have already played each other`
        );
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  generateSwissPairings,
  validatePairings,
  buildOpponentHistory,
  hasHadBye
};
