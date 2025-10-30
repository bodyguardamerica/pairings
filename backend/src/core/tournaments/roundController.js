const { pool } = require('../../config/database');
const { body, validationResult } = require('express-validator');
const { generateSwissPairings } = require('./swissPairing');
const GameModuleFactory = require('../../modules/GameModuleFactory');

/**
 * Create and start a new round with pairings
 */
const createRound = async (req, res) => {
  const client = await pool.connect();

  try {
    const { tournamentId } = req.params;

    // Check if user is organizer
    const tournamentResult = await client.query(
      'SELECT * FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = tournamentResult.rows[0];
    const coOrganizers = tournament.co_organizers || [];

    // Check if user is organizer, co-organizer, or admin
    const isOrganizer = tournament.organizer_id === req.user.id;
    const isCoOrganizer = coOrganizers.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isCoOrganizer && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer or co-organizers can create rounds'
      });
    }

    // Check tournament status
    // Allow creating round 1 from registration status (will auto-activate)
    // For subsequent rounds, tournament must be active
    if (tournament.current_round === 0) {
      // Creating first round - allow from registration or active status
      if (tournament.status !== 'registration' && tournament.status !== 'active') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Tournament must be in registration or active status to create first round'
        });
      }
    } else {
      // Creating subsequent rounds - must be active
      if (tournament.status !== 'active') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Tournament must be active to create rounds'
        });
      }
    }

    // Check if current round is complete
    if (tournament.current_round > 0) {
      const currentRoundResult = await client.query(
        'SELECT status FROM rounds WHERE tournament_id = $1 AND round_number = $2',
        [tournamentId, tournament.current_round]
      );

      if (currentRoundResult.rows[0]?.status !== 'completed') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Current round must be completed before creating next round'
        });
      }
    }

    // Check if we've reached max rounds
    if (tournament.current_round >= tournament.total_rounds) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tournament has reached maximum number of rounds'
      });
    }

    const nextRoundNumber = tournament.current_round + 1;

    await client.query('BEGIN');

    // Get active players with their current standings
    const playersResult = await client.query(
      `SELECT tp.*, u.username, u.first_name, u.last_name,
              COALESCE(SUM(CASE WHEN m.winner_id = tp.id THEN 1 ELSE 0 END), 0) as wins,
              COALESCE(SUM(CASE WHEN m.winner_id != tp.id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END), 0) as losses
       FROM tournament_players tp
       JOIN users u ON tp.player_id = u.id
       LEFT JOIN matches m ON (m.player1_id = tp.id OR m.player2_id = tp.id)
         AND m.tournament_id = $1 AND m.status = 'completed'
       WHERE tp.tournament_id = $1 AND tp.dropped = false
       GROUP BY tp.id, u.username, u.first_name, u.last_name`,
      [tournamentId]
    );

    const players = playersResult.rows;

    if (players.length < 2) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Need at least 2 active players to create a round'
      });
    }

    // Get previous matches
    const previousMatchesResult = await client.query(
      `SELECT * FROM matches WHERE tournament_id = $1 AND status = 'completed'`,
      [tournamentId]
    );

    const previousMatches = previousMatchesResult.rows;

    // Generate pairings
    const pairings = generateSwissPairings(players, previousMatches, nextRoundNumber);

    // Create round
    const roundResult = await client.query(
      `INSERT INTO rounds (tournament_id, round_number, status, started_at)
       VALUES ($1, $2, 'active', CURRENT_TIMESTAMP)
       RETURNING *`,
      [tournamentId, nextRoundNumber]
    );

    const round = roundResult.rows[0];

    // Create matches
    const matches = [];
    for (const pairing of pairings) {
      const matchResult = await client.query(
        `INSERT INTO matches (
          round_id, tournament_id, table_number,
          player1_id, player2_id, status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          round.id,
          tournamentId,
          pairing.tableNumber,
          pairing.player1_id,
          pairing.player2_id,
          pairing.is_bye ? 'bye' : 'pending'
        ]
      );

      matches.push(matchResult.rows[0]);

      // If it's a bye, auto-complete it
      if (pairing.is_bye) {
        await client.query(
          `UPDATE matches
           SET status = 'completed',
               winner_id = player1_id,
               player1_score = 1,
               player2_score = 0,
               completed_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [matchResult.rows[0].id]
        );
      }
    }

    // Update tournament current_round
    // If this is round 1, also activate the tournament
    if (nextRoundNumber === 1) {
      await client.query(
        'UPDATE tournaments SET current_round = $1, status = $2 WHERE id = $3',
        [nextRoundNumber, 'active', tournamentId]
      );
    } else {
      await client.query(
        'UPDATE tournaments SET current_round = $1 WHERE id = $2',
        [nextRoundNumber, tournamentId]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Round created successfully',
      round: {
        id: round.id,
        tournamentId: round.tournament_id,
        roundNumber: round.round_number,
        status: round.status,
        startedAt: round.started_at
      },
      matches: matches.map(formatMatchResponse)
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create round error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create round'
    });
  } finally {
    client.release();
  }
};

/**
 * Get round details with matches
 */
const getRound = async (req, res) => {
  try {
    const { tournamentId, roundNumber } = req.params;

    const roundResult = await pool.query(
      'SELECT * FROM rounds WHERE tournament_id = $1 AND round_number = $2',
      [tournamentId, roundNumber]
    );

    if (roundResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Round not found'
      });
    }

    const round = roundResult.rows[0];

    // Get matches with player details
    const matchesResult = await pool.query(
      `SELECT m.*,
              p1.username as player1_username, p1.first_name as player1_first_name, p1.last_name as player1_last_name,
              tp1.faction as player1_faction, tp1.list_name as player1_list_name,
              p2.username as player2_username, p2.first_name as player2_first_name, p2.last_name as player2_last_name,
              tp2.faction as player2_faction, tp2.list_name as player2_list_name
       FROM matches m
       LEFT JOIN tournament_players tp1 ON m.player1_id = tp1.id
       LEFT JOIN users p1 ON tp1.player_id = p1.id
       LEFT JOIN tournament_players tp2 ON m.player2_id = tp2.id
       LEFT JOIN users p2 ON tp2.player_id = p2.id
       WHERE m.round_id = $1
       ORDER BY m.table_number`,
      [round.id]
    );

    res.json({
      round: {
        id: round.id,
        tournamentId: round.tournament_id,
        roundNumber: round.round_number,
        status: round.status,
        startedAt: round.started_at,
        completedAt: round.completed_at
      },
      matches: matchesResult.rows.map(formatMatchResponse)
    });
  } catch (error) {
    console.error('Get round error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch round'
    });
  }
};

/**
 * Submit match result
 */
const submitMatchResult = async (req, res) => {
  const client = await pool.connect();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { matchId } = req.params;
    const {
      winner_id,
      player1_control_points,
      player2_control_points,
      player1_army_points,
      player2_army_points,
      scenario,
      result_type
    } = req.body;

    // Get match details
    const matchResult = await client.query(
      `SELECT m.*, t.game_system, t.organizer_id
       FROM matches m
       JOIN tournaments t ON m.tournament_id = t.id
       WHERE m.id = $1`,
      [matchId]
    );

    if (matchResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Match not found'
      });
    }

    const match = matchResult.rows[0];

    // Check if match is already completed
    if (match.status === 'completed' || match.status === 'bye') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Match is already completed'
      });
    }

    // Check authorization (organizer, admin, or player in the match)
    const isOrganizer = match.organizer_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isPlayer = match.player1_id === req.user.id || match.player2_id === req.user.id;

    if (!isOrganizer && !isAdmin && !isPlayer) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to submit results for this match'
      });
    }

    // Validate using game module
    const gameModule = GameModuleFactory.getModule(match.game_system);
    const validation = gameModule.validateMatchResult({
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      winner_id,
      player1_control_points,
      player2_control_points,
      player1_army_points,
      player2_army_points,
      scenario,
      result_type
    });

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Calculate scores using game module
    const scores = gameModule.calculateMatchScore({
      player1_id: match.player1_id,
      player2_id: match.player2_id,
      winner_id,
      player1_control_points,
      player2_control_points,
      player1_army_points,
      player2_army_points
    });

    await client.query('BEGIN');

    // Update match
    const updateResult = await client.query(
      `UPDATE matches
       SET status = 'completed',
           winner_id = $1,
           player1_score = $2,
           player2_score = $3,
           player1_control_points = $4,
           player2_control_points = $5,
           player1_army_points = $6,
           player2_army_points = $7,
           scenario = $8,
           result_data = $9,
           completed_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [
        scores.winner_id,
        scores.player1_score,
        scores.player2_score,
        scores.player1_control_points,
        scores.player2_control_points,
        scores.player1_army_points,
        scores.player2_army_points,
        scenario,
        JSON.stringify({ result_type }),
        matchId
      ]
    );

    // Check if all matches in round are complete
    const roundMatchesResult = await client.query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status = 'completed' OR status = 'bye' THEN 1 ELSE 0 END) as completed
       FROM matches
       WHERE round_id = $1`,
      [match.round_id]
    );

    const { total, completed } = roundMatchesResult.rows[0];

    // If all matches complete, mark round as completed
    if (parseInt(total) === parseInt(completed)) {
      await client.query(
        `UPDATE rounds
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [match.round_id]
      );
    }

    await client.query('COMMIT');

    res.json({
      message: 'Match result submitted successfully',
      match: formatMatchResponse(updateResult.rows[0])
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Submit match result error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit match result'
    });
  } finally {
    client.release();
  }
};

/**
 * Get tournament standings
 */
const getStandings = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Get tournament
    const tournamentResult = await pool.query(
      'SELECT game_system FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const { game_system } = tournamentResult.rows[0];

    // Get players
    const playersResult = await pool.query(
      `SELECT tp.*, u.username, u.first_name, u.last_name
       FROM tournament_players tp
       JOIN users u ON tp.player_id = u.id
       WHERE tp.tournament_id = $1`,
      [tournamentId]
    );

    // Get completed matches
    const matchesResult = await pool.query(
      `SELECT * FROM matches
       WHERE tournament_id = $1 AND (status = 'completed' OR status = 'bye')`,
      [tournamentId]
    );

    // Calculate standings using game module
    const gameModule = GameModuleFactory.getModule(game_system);
    const standings = gameModule.calculateStandings(
      playersResult.rows,
      matchesResult.rows
    );

    res.json({
      standings: standings.map(s => gameModule.formatStanding(s))
    });
  } catch (error) {
    console.error('Get standings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to calculate standings'
    });
  }
};

/**
 * Format match response
 */
function formatMatchResponse(match) {
  return {
    id: match.id,
    roundId: match.round_id,
    tournamentId: match.tournament_id,
    tableNumber: match.table_number,
    player1: match.player1_id ? {
      id: match.player1_id,
      username: match.player1_username,
      firstName: match.player1_first_name,
      lastName: match.player1_last_name,
      faction: match.player1_faction,
      listName: match.player1_list_name,
      score: match.player1_score,
      controlPoints: match.player1_control_points,
      armyPoints: match.player1_army_points
    } : null,
    player2: match.player2_id ? {
      id: match.player2_id,
      username: match.player2_username,
      firstName: match.player2_first_name,
      lastName: match.player2_last_name,
      faction: match.player2_faction,
      listName: match.player2_list_name,
      score: match.player2_score,
      controlPoints: match.player2_control_points,
      armyPoints: match.player2_army_points
    } : null,
    winnerId: match.winner_id,
    scenario: match.scenario,
    status: match.status,
    resultData: match.result_data,
    startedAt: match.started_at,
    completedAt: match.completed_at
  };
}

/**
 * Validation rules
 */
const submitMatchResultValidation = [
  body('winner_id')
    .notEmpty()
    .withMessage('Winner is required'),
  body('player1_control_points')
    .isInt({ min: 0 })
    .withMessage('Player 1 control points must be a non-negative integer'),
  body('player2_control_points')
    .isInt({ min: 0 })
    .withMessage('Player 2 control points must be a non-negative integer'),
  body('player1_army_points')
    .isInt({ min: 0 })
    .withMessage('Player 1 army points must be a non-negative integer'),
  body('player2_army_points')
    .isInt({ min: 0 })
    .withMessage('Player 2 army points must be a non-negative integer')
];

module.exports = {
  createRound,
  getRound,
  submitMatchResult,
  getStandings,
  submitMatchResultValidation
};
