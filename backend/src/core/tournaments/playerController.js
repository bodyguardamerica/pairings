const { pool } = require('../../config/database');
const { validationResult } = require('express-validator');

/**
 * Drop player from tournament
 */
const dropPlayer = async (req, res) => {
  try {
    const { tournamentId, playerId } = req.params;

    // Check if user is organizer or the player themselves
    const tournamentResult = await pool.query(
      'SELECT organizer_id FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const { organizer_id } = tournamentResult.rows[0];
    const isOrganizer = organizer_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Get player's tournament_players record
    const playerResult = await pool.query(
      'SELECT * FROM tournament_players WHERE tournament_id = $1 AND id = $2',
      [tournamentId, playerId]
    );

    if (playerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Player not registered for this tournament'
      });
    }

    const tournamentPlayer = playerResult.rows[0];
    const isSelf = tournamentPlayer.player_id === req.user.id;

    if (!isOrganizer && !isAdmin && !isSelf) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You cannot drop this player'
      });
    }

    // Get current round
    const currentRoundResult = await pool.query(
      'SELECT current_round FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    const currentRound = currentRoundResult.rows[0].current_round;

    // Mark player as dropped
    await pool.query(
      'UPDATE tournament_players SET dropped = true, drop_round = $1 WHERE id = $2',
      [currentRound, playerId]
    );

    res.json({
      message: 'Player dropped from tournament',
      playerId,
      dropRound: currentRound
    });
  } catch (error) {
    console.error('Drop player error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to drop player'
    });
  }
};

/**
 * Unregister player from tournament (before tournament starts)
 */
const unregisterPlayer = async (req, res) => {
  try {
    const { tournamentId, playerId } = req.params;

    // Check tournament status
    const tournamentResult = await pool.query(
      'SELECT organizer_id, status, current_round FROM tournaments WHERE id = $1',
      [tournamentId]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = tournamentResult.rows[0];

    // Can only unregister before tournament starts or if no rounds have been played
    if (tournament.current_round > 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Use drop endpoint after tournament has started'
      });
    }

    // Get player record
    const playerResult = await pool.query(
      'SELECT * FROM tournament_players WHERE tournament_id = $1 AND id = $2',
      [tournamentId, playerId]
    );

    if (playerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Player not registered for this tournament'
      });
    }

    const tournamentPlayer = playerResult.rows[0];
    const isOrganizer = tournament.organizer_id === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSelf = tournamentPlayer.player_id === req.user.id;

    if (!isOrganizer && !isAdmin && !isSelf) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You cannot unregister this player'
      });
    }

    // Delete registration
    await pool.query(
      'DELETE FROM tournament_players WHERE id = $1',
      [playerId]
    );

    res.json({
      message: 'Player unregistered from tournament'
    });
  } catch (error) {
    console.error('Unregister player error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to unregister player'
    });
  }
};

/**
 * Update player list/faction
 */
const updatePlayerList = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { tournamentId, playerId } = req.params;
    const { listName, faction } = req.body;

    // Get player record
    const playerResult = await pool.query(
      'SELECT * FROM tournament_players WHERE tournament_id = $1 AND id = $2',
      [tournamentId, playerId]
    );

    if (playerResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Player not registered for this tournament'
      });
    }

    const tournamentPlayer = playerResult.rows[0];

    // Only the player themselves can update their list
    if (tournamentPlayer.player_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own list'
      });
    }

    // Update list
    const result = await pool.query(
      `UPDATE tournament_players
       SET list_name = COALESCE($1, list_name),
           faction = COALESCE($2, faction)
       WHERE id = $3
       RETURNING *`,
      [listName, faction, playerId]
    );

    res.json({
      message: 'Player list updated',
      player: {
        id: result.rows[0].id,
        listName: result.rows[0].list_name,
        faction: result.rows[0].faction
      }
    });
  } catch (error) {
    console.error('Update player list error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update player list'
    });
  }
};

/**
 * Get player statistics across all tournaments
 */
const getPlayerStatistics = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Get player info including privacy settings
    const userResult = await pool.query(
      'SELECT id, username, first_name, last_name, stats_public FROM users WHERE id = $1',
      [playerId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Player not found'
      });
    }

    const player = userResult.rows[0];

    // Check if stats are public or if requester is the player themselves or admin
    const isOwnProfile = req.user && req.user.id === playerId;
    const isAdmin = req.user && req.user.role === 'admin';
    const isPublic = player.stats_public === true;

    if (!isPublic && !isOwnProfile && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This player has made their statistics private'
      });
    }

    // Get tournament participation stats
    const tournamentsResult = await pool.query(
      `SELECT
         COUNT(DISTINCT tp.tournament_id) as tournaments_played,
         COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN tp.tournament_id END) as tournaments_completed
       FROM tournament_players tp
       JOIN tournaments t ON tp.tournament_id = t.id
       WHERE tp.player_id = $1`,
      [playerId]
    );

    // Get match statistics
    const matchStatsResult = await pool.query(
      `SELECT
         COUNT(*) as total_matches,
         SUM(CASE WHEN m.winner_id = tp.id THEN 1 ELSE 0 END) as wins,
         SUM(CASE WHEN m.winner_id != tp.id AND m.winner_id IS NOT NULL THEN 1 ELSE 0 END) as losses,
         SUM(CASE WHEN m.status = 'bye' AND m.player1_id = tp.id THEN 1 ELSE 0 END) as byes,
         AVG(CASE
           WHEN m.player1_id = tp.id THEN m.player1_control_points
           WHEN m.player2_id = tp.id THEN m.player2_control_points
         END) as avg_control_points,
         AVG(CASE
           WHEN m.player1_id = tp.id THEN m.player1_army_points
           WHEN m.player2_id = tp.id THEN m.player2_army_points
         END) as avg_army_points
       FROM tournament_players tp
       LEFT JOIN matches m ON (m.player1_id = tp.id OR m.player2_id = tp.id)
         AND m.status IN ('completed', 'bye')
       WHERE tp.player_id = $1`,
      [playerId]
    );

    // Get faction usage
    const factionsResult = await pool.query(
      `SELECT faction, COUNT(*) as times_played
       FROM tournament_players
       WHERE player_id = $1 AND faction IS NOT NULL
       GROUP BY faction
       ORDER BY times_played DESC`,
      [playerId]
    );

    // Get recent tournaments
    const recentTournamentsResult = await pool.query(
      `SELECT
         t.id, t.name, t.start_date, t.status,
         tp.faction, tp.dropped, tp.drop_round
       FROM tournament_players tp
       JOIN tournaments t ON tp.tournament_id = t.id
       WHERE tp.player_id = $1
       ORDER BY t.start_date DESC
       LIMIT 10`,
      [playerId]
    );

    const stats = matchStatsResult.rows[0];
    const winRate = stats.total_matches > 0
      ? ((parseInt(stats.wins) / parseInt(stats.total_matches)) * 100).toFixed(1)
      : 0;

    res.json({
      player: {
        id: player.id,
        username: player.username,
        firstName: player.first_name,
        lastName: player.last_name
      },
      statistics: {
        tournaments: {
          played: parseInt(tournamentsResult.rows[0].tournaments_played),
          completed: parseInt(tournamentsResult.rows[0].tournaments_completed)
        },
        matches: {
          total: parseInt(stats.total_matches) || 0,
          wins: parseInt(stats.wins) || 0,
          losses: parseInt(stats.losses) || 0,
          byes: parseInt(stats.byes) || 0,
          winRate: parseFloat(winRate)
        },
        averages: {
          controlPoints: parseFloat(stats.avg_control_points || 0).toFixed(1),
          armyPoints: parseFloat(stats.avg_army_points || 0).toFixed(1)
        },
        factions: factionsResult.rows,
        recentTournaments: recentTournamentsResult.rows
      }
    });
  } catch (error) {
    console.error('Get player statistics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get player statistics'
    });
  }
};

/**
 * Search for players by username or name
 */
const searchPlayers = async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required'
      });
    }

    const searchTerm = `%${query.trim()}%`;

    const result = await pool.query(
      `SELECT id, username, first_name, last_name, avatar_url, stats_public
       FROM users
       WHERE stats_public = true
       AND (username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1)
       ORDER BY username
       LIMIT $2`,
      [searchTerm, parseInt(limit)]
    );

    res.json({
      players: result.rows.map(player => ({
        id: player.id,
        username: player.username,
        firstName: player.first_name,
        lastName: player.last_name,
        avatarUrl: player.avatar_url
      })),
      count: result.rows.length
    });
  } catch (error) {
    console.error('Search players error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search players'
    });
  }
};

/**
 * Update user privacy settings
 */
const updatePrivacySettings = async (req, res) => {
  try {
    const { statsPublic } = req.body;

    if (statsPublic === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'statsPublic field is required'
      });
    }

    const result = await pool.query(
      'UPDATE users SET stats_public = $1 WHERE id = $2 RETURNING id, stats_public',
      [statsPublic, req.user.id]
    );

    res.json({
      message: 'Privacy settings updated successfully',
      settings: {
        statsPublic: result.rows[0].stats_public
      }
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update privacy settings'
    });
  }
};

module.exports = {
  dropPlayer,
  unregisterPlayer,
  updatePlayerList,
  getPlayerStatistics,
  searchPlayers,
  updatePrivacySettings
};
