const { pool } = require('../../config/database');
const { body, param, validationResult } = require('express-validator');

/**
 * Create a new tournament
 */
const createTournament = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      name,
      gameSystem,
      format,
      status,
      description,
      location,
      startDate,
      endDate,
      maxPlayers,
      totalRounds,
      settings,
      isRated
    } = req.body;

    const organizerId = req.user.id;

    // Insert tournament
    const result = await pool.query(
      `INSERT INTO tournaments (
        name, game_system, format, organizer_id, description,
        location, start_date, end_date, max_players, total_rounds,
        status, settings, is_rated
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        name,
        gameSystem || 'warmachine',
        format,
        organizerId,
        description || null,
        location || null,
        startDate,
        endDate || null,
        maxPlayers || null,
        totalRounds,
        status || 'draft',
        settings || {},
        isRated !== undefined ? isRated : true
      ]
    );

    const tournament = result.rows[0];

    res.status(201).json({
      message: 'Tournament created successfully',
      tournament: formatTournamentResponse(tournament)
    });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create tournament'
    });
  }
};

/**
 * Get all tournaments (with filters)
 */
const getTournaments = async (req, res) => {
  try {
    const { status, gameSystem, organizerId, rated, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT t.*,
             u.username as organizer_username,
             u.first_name as organizer_first_name,
             u.last_name as organizer_last_name,
             COUNT(DISTINCT tp.id) as player_count
      FROM tournaments t
      LEFT JOIN users u ON t.organizer_id = u.id
      LEFT JOIN tournament_players tp ON t.id = tp.tournament_id AND tp.dropped = false
      WHERE 1=1
    `;

    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND t.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (gameSystem) {
      query += ` AND t.game_system = $${paramIndex}`;
      params.push(gameSystem);
      paramIndex++;
    }

    if (organizerId) {
      query += ` AND t.organizer_id = $${paramIndex}`;
      params.push(organizerId);
      paramIndex++;
    }

    if (rated !== undefined) {
      query += ` AND t.is_rated = $${paramIndex}`;
      params.push(rated === 'true');
      paramIndex++;
    }

    query += `
      GROUP BY t.id, u.username, u.first_name, u.last_name
      ORDER BY t.start_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    res.json({
      tournaments: result.rows.map(formatTournamentResponse),
      count: result.rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tournaments'
    });
  }
};

/**
 * Get tournament by ID
 */
const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.*,
              u.username as organizer_username,
              u.first_name as organizer_first_name,
              u.last_name as organizer_last_name,
              u.email as organizer_email,
              COUNT(DISTINCT tp.id) as player_count
       FROM tournaments t
       LEFT JOIN users u ON t.organizer_id = u.id
       LEFT JOIN tournament_players tp ON t.id = tp.tournament_id AND tp.dropped = false
       WHERE t.id = $1
       GROUP BY t.id, u.username, u.first_name, u.last_name, u.email`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    res.json({
      tournament: formatTournamentResponse(result.rows[0])
    });
  } catch (error) {
    console.error('Get tournament error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tournament'
    });
  }
};

/**
 * Update tournament
 */
const updateTournament = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const {
      name,
      description,
      location,
      startDate,
      endDate,
      maxPlayers,
      status,
      settings,
      isRated
    } = req.body;

    // Check if tournament exists and user is organizer
    const checkResult = await pool.query(
      'SELECT organizer_id, co_organizers FROM tournaments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = checkResult.rows[0];
    const coOrganizers = tournament.co_organizers || [];

    // Only organizer, co-organizer, or admin can update
    const isOrganizer = tournament.organizer_id === req.user.id;
    const isCoOrganizer = coOrganizers.includes(req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOrganizer && !isCoOrganizer && !isAdmin) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer or co-organizers can update this tournament'
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }

    if (location !== undefined) {
      updates.push(`location = $${paramIndex}`);
      params.push(location);
      paramIndex++;
    }

    if (startDate !== undefined) {
      updates.push(`start_date = $${paramIndex}`);
      params.push(startDate);
      paramIndex++;
    }

    if (endDate !== undefined) {
      updates.push(`end_date = $${paramIndex}`);
      params.push(endDate);
      paramIndex++;
    }

    if (maxPlayers !== undefined) {
      updates.push(`max_players = $${paramIndex}`);
      params.push(maxPlayers);
      paramIndex++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (settings !== undefined) {
      updates.push(`settings = $${paramIndex}`);
      params.push(JSON.stringify(settings));
      paramIndex++;
    }

    if (isRated !== undefined) {
      updates.push(`is_rated = $${paramIndex}`);
      params.push(isRated);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No fields to update'
      });
    }

    params.push(id);

    const updateQuery = `
      UPDATE tournaments
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, params);

    res.json({
      message: 'Tournament updated successfully',
      tournament: formatTournamentResponse(result.rows[0])
    });
  } catch (error) {
    console.error('Update tournament error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update tournament'
    });
  }
};

/**
 * Delete tournament
 */
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tournament exists and user is organizer
    const checkResult = await pool.query(
      'SELECT organizer_id FROM tournaments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = checkResult.rows[0];

    // Only organizer or admin can delete
    if (tournament.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer can delete this tournament'
      });
    }

    await pool.query('DELETE FROM tournaments WHERE id = $1', [id]);

    res.json({
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete tournament'
    });
  }
};

/**
 * Register player for tournament
 */
const registerPlayer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { listName, faction } = req.body;
    const playerId = req.user.id;

    // Check if tournament exists and is accepting registrations
    const tournamentResult = await pool.query(
      `SELECT id, status, max_players,
              (SELECT COUNT(*) FROM tournament_players WHERE tournament_id = $1 AND dropped = false) as current_players
       FROM tournaments WHERE id = $1`,
      [id]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = tournamentResult.rows[0];

    if (tournament.status !== 'registration' && tournament.status !== 'draft') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tournament is not accepting registrations'
      });
    }

    if (tournament.max_players && tournament.current_players >= tournament.max_players) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tournament is full'
      });
    }

    // Check if player is already registered
    const existingRegistration = await pool.query(
      'SELECT id FROM tournament_players WHERE tournament_id = $1 AND player_id = $2',
      [id, playerId]
    );

    if (existingRegistration.rows.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Player is already registered for this tournament'
      });
    }

    // Register player
    const result = await pool.query(
      `INSERT INTO tournament_players (tournament_id, player_id, list_name, faction)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, playerId, listName || null, faction || null]
    );

    res.status(201).json({
      message: 'Player registered successfully',
      registration: formatPlayerRegistration(result.rows[0])
    });
  } catch (error) {
    console.error('Register player error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register player'
    });
  }
};

/**
 * Get tournament players
 */
const getTournamentPlayers = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT tp.*, u.username, u.first_name, u.last_name, u.email
       FROM tournament_players tp
       JOIN users u ON tp.player_id = u.id
       WHERE tp.tournament_id = $1
       ORDER BY tp.registered_at ASC`,
      [id]
    );

    res.json({
      players: result.rows.map(formatPlayerRegistration),
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get tournament players error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tournament players'
    });
  }
};

/**
 * Format tournament response
 */
function formatTournamentResponse(tournament) {
  return {
    id: tournament.id,
    name: tournament.name,
    gameSystem: tournament.game_system,
    format: tournament.format,
    description: tournament.description,
    location: tournament.location,
    startDate: tournament.start_date,
    endDate: tournament.end_date,
    maxPlayers: tournament.max_players,
    currentRound: tournament.current_round,
    totalRounds: tournament.total_rounds,
    status: tournament.status,
    settings: tournament.settings,
    organizer: tournament.organizer_username ? {
      id: tournament.organizer_id,
      username: tournament.organizer_username,
      firstName: tournament.organizer_first_name,
      lastName: tournament.organizer_last_name,
      email: tournament.organizer_email
    } : { id: tournament.organizer_id },
    coOrganizers: tournament.co_organizers || [],
    playerCount: parseInt(tournament.player_count) || 0,
    createdAt: tournament.created_at,
    updatedAt: tournament.updated_at
  };
}

/**
 * Format player registration response
 */
function formatPlayerRegistration(registration) {
  return {
    id: registration.id,
    tournamentId: registration.tournament_id,
    playerId: registration.player_id,
    username: registration.username,
    firstName: registration.first_name,
    lastName: registration.last_name,
    email: registration.email,
    listName: registration.list_name,
    faction: registration.faction,
    dropped: registration.dropped,
    dropRound: registration.drop_round,
    seedScore: registration.seed_score,
    registeredAt: registration.registered_at
  };
}

/**
 * Validation rules
 */
const createTournamentValidation = [
  body('name')
    .notEmpty()
    .withMessage('Tournament name is required')
    .isLength({ max: 255 })
    .withMessage('Tournament name must not exceed 255 characters'),
  body('format')
    .notEmpty()
    .withMessage('Tournament format is required'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('totalRounds')
    .isInt({ min: 1, max: 20 })
    .withMessage('Total rounds must be between 1 and 20'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Max players must be at least 2'),
  body('gameSystem')
    .optional()
    .isIn(['warmachine', 'other'])
    .withMessage('Invalid game system')
];

const updateTournamentValidation = [
  body('name')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Tournament name must not exceed 255 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'registration', 'active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid tournament status'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 2 })
    .withMessage('Max players must be at least 2')
];

const registerPlayerValidation = [
  body('listName')
    .optional()
    .isLength({ max: 255 })
    .withMessage('List name must not exceed 255 characters'),
  body('faction')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Faction must not exceed 100 characters')
];

/**
 * Add co-organizer to tournament
 */
const addCoOrganizer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User ID is required'
      });
    }

    // Check if tournament exists and user is the main organizer
    const checkResult = await pool.query(
      'SELECT organizer_id, co_organizers FROM tournaments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = checkResult.rows[0];

    // Only main organizer or admin can add co-organizers
    if (tournament.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer can add co-organizers'
      });
    }

    // Check if user exists
    const userCheck = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Check if user is already the main organizer
    if (tournament.organizer_id === userId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User is already the main organizer'
      });
    }

    // Get current co-organizers
    const coOrganizers = tournament.co_organizers || [];

    // Check if already a co-organizer
    if (coOrganizers.includes(userId)) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User is already a co-organizer'
      });
    }

    // Add to co-organizers
    const updatedCoOrganizers = [...coOrganizers, userId];

    await pool.query(
      'UPDATE tournaments SET co_organizers = $1 WHERE id = $2',
      [JSON.stringify(updatedCoOrganizers), id]
    );

    res.json({
      message: 'Co-organizer added successfully',
      coOrganizer: {
        id: userCheck.rows[0].id,
        username: userCheck.rows[0].username
      }
    });
  } catch (error) {
    console.error('Add co-organizer error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add co-organizer'
    });
  }
};

/**
 * Remove co-organizer from tournament
 */
const removeCoOrganizer = async (req, res) => {
  try {
    const { id, userId } = req.params;

    // Check if tournament exists and user is the main organizer
    const checkResult = await pool.query(
      'SELECT organizer_id, co_organizers FROM tournaments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = checkResult.rows[0];

    // Only main organizer or admin can remove co-organizers
    if (tournament.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer can remove co-organizers'
      });
    }

    // Get current co-organizers
    const coOrganizers = tournament.co_organizers || [];

    // Check if user is a co-organizer
    if (!coOrganizers.includes(userId)) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User is not a co-organizer'
      });
    }

    // Remove from co-organizers
    const updatedCoOrganizers = coOrganizers.filter(id => id !== userId);

    await pool.query(
      'UPDATE tournaments SET co_organizers = $1 WHERE id = $2',
      [JSON.stringify(updatedCoOrganizers), id]
    );

    res.json({
      message: 'Co-organizer removed successfully'
    });
  } catch (error) {
    console.error('Remove co-organizer error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to remove co-organizer'
    });
  }
};

/**
 * Get co-organizers with user details
 */
const getCoOrganizers = async (req, res) => {
  try {
    const { id } = req.params;

    // Get tournament with co-organizers
    const tournamentResult = await pool.query(
      'SELECT co_organizers FROM tournaments WHERE id = $1',
      [id]
    );

    if (tournamentResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const coOrganizerIds = tournamentResult.rows[0].co_organizers || [];

    if (coOrganizerIds.length === 0) {
      return res.json({
        coOrganizers: [],
        count: 0
      });
    }

    // Get user details for co-organizers
    const usersResult = await pool.query(
      'SELECT id, username, first_name, last_name, email FROM users WHERE id = ANY($1)',
      [coOrganizerIds]
    );

    const coOrganizers = usersResult.rows.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    }));

    res.json({
      coOrganizers,
      count: coOrganizers.length
    });
  } catch (error) {
    console.error('Get co-organizers error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch co-organizers'
    });
  }
};

/**
 * Transfer tournament ownership
 */
const transferOwnership = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwnerId } = req.body;

    if (!newOwnerId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'New owner ID is required'
      });
    }

    // Check if tournament exists and user is the main organizer
    const checkResult = await pool.query(
      'SELECT organizer_id, co_organizers FROM tournaments WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tournament not found'
      });
    }

    const tournament = checkResult.rows[0];

    // Only main organizer or admin can transfer ownership
    if (tournament.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only the tournament organizer can transfer ownership'
      });
    }

    // Check if new owner exists
    const userCheck = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [newOwnerId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Can't transfer to self
    if (tournament.organizer_id === newOwnerId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot transfer ownership to current organizer'
      });
    }

    // Remove new owner from co-organizers if present
    const coOrganizers = tournament.co_organizers || [];
    const updatedCoOrganizers = coOrganizers.filter(id => id !== newOwnerId);

    // Update tournament ownership
    await pool.query(
      'UPDATE tournaments SET organizer_id = $1, co_organizers = $2 WHERE id = $3',
      [newOwnerId, JSON.stringify(updatedCoOrganizers), id]
    );

    res.json({
      message: 'Ownership transferred successfully',
      newOwner: {
        id: userCheck.rows[0].id,
        username: userCheck.rows[0].username
      }
    });
  } catch (error) {
    console.error('Transfer ownership error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to transfer ownership'
    });
  }
};

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById,
  updateTournament,
  deleteTournament,
  registerPlayer,
  getTournamentPlayers,
  addCoOrganizer,
  removeCoOrganizer,
  getCoOrganizers,
  transferOwnership,
  createTournamentValidation,
  updateTournamentValidation,
  registerPlayerValidation
};
