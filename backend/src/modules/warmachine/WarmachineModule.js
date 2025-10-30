const GameModule = require('../GameModule');

/**
 * Warmachine Steamroller 2025 Game Module
 * Implements scoring and tiebreakers for Warmachine tournaments
 */
class WarmachineModule extends GameModule {
  constructor() {
    super('warmachine');
    this.scenarios = [
      'Bunkers',
      'Invasion',
      'Mirage',
      'Recon II',
      'Spread the Net',
      'Take and Hold'
    ];
  }

  /**
   * Calculate match score for Warmachine
   * Tournament Points (TP): Win = 1, Loss = 0
   * Control Points (CP): Points scored in game
   * Army Points (AP): Enemy army points destroyed
   */
  calculateMatchScore(matchResult) {
    const {
      player1_id,
      player2_id,
      player1_control_points = 0,
      player2_control_points = 0,
      player1_army_points = 0,
      player2_army_points = 0,
      winner_id,
      is_bye = false
    } = matchResult;

    // Handle bye
    if (is_bye) {
      return {
        player1_score: 1, // TP
        player2_score: 0,
        player1_control_points,
        player2_control_points,
        player1_army_points,
        player2_army_points,
        winner_id: player1_id
      };
    }

    // Determine tournament points (1 for win, 0 for loss)
    let player1_score = 0;
    let player2_score = 0;

    if (winner_id === player1_id) {
      player1_score = 1;
    } else if (winner_id === player2_id) {
      player2_score = 1;
    }
    // Note: Draws are not possible in Steamroller, but if they were, both would get 0.5

    return {
      player1_score,
      player2_score,
      player1_control_points,
      player2_control_points,
      player1_army_points,
      player2_army_points,
      winner_id
    };
  }

  /**
   * Calculate standings with Warmachine Steamroller tiebreakers
   * Tiebreaker order:
   * 1. Tournament Points (TP) - Total wins
   * 2. Strength of Schedule (SoS) - Sum of opponents' TPs
   * 3. Control Points (CP)
   * 4. Army Points Destroyed (AP)
   * 5. Opponent's Strength of Schedule (SoS2) - Sum of opponents' SoS
   */
  calculateStandings(players, matches) {
    // Initialize player records
    const standings = players.map(player => ({
      player_id: player.id,
      username: player.username,
      first_name: player.first_name,
      last_name: player.last_name,
      faction: player.faction,
      list_name: player.list_name,
      tournament_points: 0,
      control_points: 0,
      army_points: 0,
      strength_of_schedule: 0,
      opponents_sos: 0,
      wins: 0,
      losses: 0,
      opponents: []
    }));

    const standingsMap = new Map(standings.map(s => [s.player_id, s]));

    // First pass: Calculate TP, CP, AP, and track opponents
    matches.forEach(match => {
      if (match.status !== 'completed') return;

      const player1Standing = standingsMap.get(match.player1_id);
      const player2Standing = standingsMap.get(match.player2_id);

      if (!player1Standing || !player2Standing) return;

      // Add tournament points
      player1Standing.tournament_points += match.player1_score || 0;
      player2Standing.tournament_points += match.player2_score || 0;

      // Add control points
      player1Standing.control_points += match.player1_control_points || 0;
      player2Standing.control_points += match.player2_control_points || 0;

      // Add army points destroyed
      player1Standing.army_points += match.player1_army_points || 0;
      player2Standing.army_points += match.player2_army_points || 0;

      // Track wins/losses
      if (match.winner_id === match.player1_id) {
        player1Standing.wins++;
        player2Standing.losses++;
      } else if (match.winner_id === match.player2_id) {
        player2Standing.wins++;
        player1Standing.losses++;
      }

      // Track opponents
      if (match.player2_id) { // Not a bye
        player1Standing.opponents.push(match.player2_id);
        player2Standing.opponents.push(match.player1_id);
      }
    });

    // Second pass: Calculate Strength of Schedule (SoS)
    standings.forEach(standing => {
      standing.strength_of_schedule = standing.opponents.reduce((sum, oppId) => {
        const opponent = standingsMap.get(oppId);
        return sum + (opponent ? opponent.tournament_points : 0);
      }, 0);
    });

    // Third pass: Calculate Opponent's Strength of Schedule (SoS2)
    standings.forEach(standing => {
      standing.opponents_sos = standing.opponents.reduce((sum, oppId) => {
        const opponent = standingsMap.get(oppId);
        return sum + (opponent ? opponent.strength_of_schedule : 0);
      }, 0);
    });

    // Sort by tiebreakers
    standings.sort((a, b) => {
      // 1. Tournament Points (descending)
      if (b.tournament_points !== a.tournament_points) {
        return b.tournament_points - a.tournament_points;
      }

      // 2. Strength of Schedule (descending)
      if (b.strength_of_schedule !== a.strength_of_schedule) {
        return b.strength_of_schedule - a.strength_of_schedule;
      }

      // 3. Control Points (descending)
      if (b.control_points !== a.control_points) {
        return b.control_points - a.control_points;
      }

      // 4. Army Points (descending)
      if (b.army_points !== a.army_points) {
        return b.army_points - a.army_points;
      }

      // 5. Opponent's SoS (descending)
      return b.opponents_sos - a.opponents_sos;
    });

    // Add rank
    standings.forEach((standing, index) => {
      standing.rank = index + 1;
    });

    return standings;
  }

  /**
   * Validate Warmachine match result
   */
  validateMatchResult(matchResult) {
    const errors = [];

    // Must have a winner (no draws in Steamroller)
    if (!matchResult.winner_id && !matchResult.is_bye) {
      errors.push('Winner is required (Steamroller does not allow draws)');
    }

    // Control points must be non-negative
    if (matchResult.player1_control_points < 0 || matchResult.player2_control_points < 0) {
      errors.push('Control points cannot be negative');
    }

    // Army points must be non-negative
    if (matchResult.player1_army_points < 0 || matchResult.player2_army_points < 0) {
      errors.push('Army points cannot be negative');
    }

    // Winner must have more CP or AP (unless assassination/timeout)
    const resultType = matchResult.result_type;
    if (matchResult.winner_id && !['assassination', 'timeout', 'concession'].includes(resultType)) {
      const winnerIsPlayer1 = matchResult.winner_id === matchResult.player1_id;
      const winnerCP = winnerIsPlayer1 ? matchResult.player1_control_points : matchResult.player2_control_points;
      const loserCP = winnerIsPlayer1 ? matchResult.player2_control_points : matchResult.player1_control_points;

      if (winnerCP < 5 && winnerCP <= loserCP) {
        errors.push('Winner must have more control points (unless assassination/timeout/concession)');
      }
    }

    // Scenario should be valid
    if (matchResult.scenario && !this.scenarios.includes(matchResult.scenario)) {
      errors.push(`Invalid scenario. Must be one of: ${this.scenarios.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get Steamroller 2025 scenarios
   */
  getScenarios() {
    return this.scenarios.map(name => ({
      name,
      description: `Steamroller 2025 - ${name}`
    }));
  }

  /**
   * Get scoring fields for Warmachine
   */
  getScoringFields() {
    return [
      {
        name: 'winner_id',
        type: 'uuid',
        required: true,
        description: 'Player who won the match'
      },
      {
        name: 'player1_control_points',
        type: 'integer',
        required: true,
        min: 0,
        max: 10,
        description: 'Control points scored by player 1'
      },
      {
        name: 'player2_control_points',
        type: 'integer',
        required: true,
        min: 0,
        max: 10,
        description: 'Control points scored by player 2'
      },
      {
        name: 'player1_army_points',
        type: 'integer',
        required: true,
        min: 0,
        description: 'Enemy army points destroyed by player 1'
      },
      {
        name: 'player2_army_points',
        type: 'integer',
        required: true,
        min: 0,
        description: 'Enemy army points destroyed by player 2'
      },
      {
        name: 'scenario',
        type: 'string',
        required: false,
        enum: this.scenarios,
        description: 'Scenario played'
      },
      {
        name: 'result_type',
        type: 'string',
        required: false,
        enum: ['scenario', 'assassination', 'timeout', 'concession'],
        description: 'How the match was won'
      }
    ];
  }

  /**
   * Format standing for display
   */
  formatStanding(standing) {
    return {
      rank: standing.rank,
      playerId: standing.player_id,
      playerName: standing.username,
      firstName: standing.first_name,
      lastName: standing.last_name,
      faction: standing.faction,
      listName: standing.list_name,
      record: `${standing.wins}-${standing.losses}`,
      tournamentPoints: standing.tournament_points,
      strengthOfSchedule: standing.strength_of_schedule,
      controlPoints: standing.control_points,
      armyPoints: standing.army_points,
      opponentsSoS: standing.opponents_sos
    };
  }
}

module.exports = WarmachineModule;
