const { pool } = require('../../config/database');
const { validationResult } = require('express-validator');
const GameModuleFactory = require('../../modules/GameModuleFactory');

/**
 * Edit/update match result
 */
const editMatchResult = async (req, res) => {
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
      `SELECT m.*, t.game_system, t.organizer_id, t.co_organizers
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

    // Check if match is completed (can only edit completed matches)
    if (match.status !== 'completed') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Can only edit completed matches'
      });
    }

    // Check authorization (organizer, co-organizer, or admin)
    const coOrganizers = match.co_organizers || [];
    const isOrganizer = match.organizer_id === req.user.id;
    const isCoOrganizer = coOrganizers.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isCoOrganizer && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only tournament organizer, co-organizers, or admin can edit match results'
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
       SET winner_id = $1,
           player1_score = $2,
           player2_score = $3,
           player1_control_points = $4,
           player2_control_points = $5,
           player1_army_points = $6,
           player2_army_points = $7,
           scenario = $8,
           result_data = $9
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
        JSON.stringify({ result_type, edited: true, edited_at: new Date().toISOString() }),
        matchId
      ]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Match result updated successfully',
      match: {
        id: updateResult.rows[0].id,
        winnerId: updateResult.rows[0].winner_id,
        player1Score: updateResult.rows[0].player1_score,
        player2Score: updateResult.rows[0].player2_score,
        player1ControlPoints: updateResult.rows[0].player1_control_points,
        player2ControlPoints: updateResult.rows[0].player2_control_points,
        player1ArmyPoints: updateResult.rows[0].player1_army_points,
        player2ArmyPoints: updateResult.rows[0].player2_army_points,
        scenario: updateResult.rows[0].scenario
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Edit match result error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to edit match result'
    });
  } finally {
    client.release();
  }
};

/**
 * Delete match result (reset to pending)
 */
const deleteMatchResult = async (req, res) => {
  const client = await pool.connect();

  try {
    const { matchId } = req.params;

    // Get match details
    const matchResult = await client.query(
      `SELECT m.*, t.organizer_id, t.co_organizers, r.status as round_status
       FROM matches m
       JOIN tournaments t ON m.tournament_id = t.id
       JOIN rounds r ON m.round_id = r.id
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

    // Check authorization (organizer, co-organizer, or admin)
    const coOrganizers = match.co_organizers || [];
    const isOrganizer = match.organizer_id === req.user.id;
    const isCoOrganizer = coOrganizers.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isCoOrganizer && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only tournament organizer, co-organizers, or admin can delete match results'
      });
    }

    // Can't delete if round is completed
    if (match.round_status === 'completed') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete results from completed rounds. Delete the round first.'
      });
    }

    await client.query('BEGIN');

    // Reset match to pending
    await client.query(
      `UPDATE matches
       SET status = 'pending',
           winner_id = NULL,
           player1_score = 0,
           player2_score = 0,
           player1_control_points = 0,
           player2_control_points = 0,
           player1_army_points = 0,
           player2_army_points = 0,
           scenario = NULL,
           result_data = '{}'::jsonb,
           completed_at = NULL
       WHERE id = $1`,
      [matchId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Match result deleted, reset to pending'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete match result error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete match result'
    });
  } finally {
    client.release();
  }
};

/**
 * Delete round (and all its matches)
 */
const deleteRound = async (req, res) => {
  const client = await pool.connect();

  try {
    const { tournamentId, roundNumber } = req.params;

    // Get tournament
    const tournamentResult = await client.query(
      'SELECT organizer_id, current_round FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = tournamentResult.rows[0];

    // Check authorization
    const isOrganizer = tournament.organizer_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only tournament organizer or admin can delete rounds'
      });
    }

    // Can only delete the most recent round
    if (parseInt(roundNumber) !== tournament.current_round) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Can only delete the most recent round'
      });
    }

    // Get round
    const roundResult = await client.query(
      'SELECT id FROM rounds WHERE tournament_id = $1 AND round_number = $2',
      [tournamentId, roundNumber]
    );

    if (roundResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Round not found'
      });
    }

    const roundId = roundResult.rows[0].id;

    await client.query('BEGIN');

    // Delete all matches in this round (CASCADE will handle this, but explicit is clear)
    await client.query(
      'DELETE FROM matches WHERE round_id = $1',
      [roundId]
    );

    // Delete round
    await client.query(
      'DELETE FROM rounds WHERE id = $1',
      [roundId]
    );

    // Decrement tournament current_round
    await client.query(
      'UPDATE tournaments SET current_round = current_round - 1 WHERE id = $1',
      [tournamentId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Round deleted successfully',
      deletedRound: roundNumber
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete round error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete round'
    });
  } finally {
    client.release();
  }
};

module.exports = {
  editMatchResult,
  deleteMatchResult,
  deleteRound
};
