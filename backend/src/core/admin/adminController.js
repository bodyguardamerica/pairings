const { pool } = require('../../config/database');
const { validationResult } = require('express-validator');

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, search, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        id, email, username, role, first_name, last_name,
        avatar_url, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by role
    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    // Search by username or email
    if (search) {
      query += ` AND (username ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const countParams = [];
    let countIndex = 1;

    if (role) {
      countQuery += ` AND role = $${countIndex}`;
      countParams.push(role);
      countIndex++;
    }

    if (search) {
      countQuery += ` AND (username ILIKE $${countIndex} OR email ILIKE $${countIndex})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get users'
    });
  }
};

/**
 * Update user role (admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['player', 'to', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Prevent admin from demoting themselves
    if (userId === req.user.id && role !== 'admin') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot change your own role'
      });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, username, role FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Update role
    const result = await pool.query(
      `UPDATE users
       SET role = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, email, role, first_name, last_name`,
      [role, userId]
    );

    res.json({
      message: 'User role updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user role'
    });
  }
};

/**
 * Delete user (admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Delete user (cascades to tournament_players, tournaments, etc.)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: userResult.rows[0].id,
        username: userResult.rows[0].username
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user'
    });
  }
};

/**
 * Get system statistics (admin only)
 */
const getSystemStats = async (req, res) => {
  try {
    // Get user statistics
    const usersResult = await pool.query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'player' THEN 1 END) as players,
        COUNT(CASE WHEN role = 'to' THEN 1 END) as organizers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_month
      FROM users
    `);

    // Get tournament statistics
    const tournamentsResult = await pool.query(`
      SELECT
        COUNT(*) as total_tournaments,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
        COUNT(CASE WHEN status = 'registration' THEN 1 END) as registration,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as created_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as created_month
      FROM tournaments
    `);

    // Get match statistics
    const matchesResult = await pool.query(`
      SELECT
        COUNT(*) as total_matches,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_matches,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_matches,
        AVG(CASE WHEN status = 'completed' THEN player1_control_points + player2_control_points END) as avg_total_cp,
        AVG(CASE WHEN status = 'completed' THEN player1_army_points + player2_army_points END) as avg_total_ap
      FROM matches
    `);

    // Get player engagement statistics
    const engagementResult = await pool.query(`
      SELECT
        COUNT(DISTINCT player_id) as active_players,
        AVG(matches_per_player) as avg_matches_per_player
      FROM (
        SELECT
          tp.player_id,
          COUNT(m.id) as matches_per_player
        FROM tournament_players tp
        LEFT JOIN matches m ON (m.player1_id = tp.id OR m.player2_id = tp.id)
        GROUP BY tp.player_id
      ) player_stats
    `);

    // Get game system breakdown
    const gameSystemsResult = await pool.query(`
      SELECT
        game_system,
        COUNT(*) as tournament_count
      FROM tournaments
      GROUP BY game_system
      ORDER BY tournament_count DESC
    `);

    // Get recent activity
    const recentActivityResult = await pool.query(`
      SELECT
        'tournament' as type,
        t.name as description,
        t.created_at as timestamp
      FROM tournaments t
      WHERE t.created_at > NOW() - INTERVAL '7 days'
      UNION ALL
      SELECT
        'user' as type,
        u.username as description,
        u.created_at as timestamp
      FROM users u
      WHERE u.created_at > NOW() - INTERVAL '7 days'
      ORDER BY timestamp DESC
      LIMIT 20
    `);

    res.json({
      users: {
        total: parseInt(usersResult.rows[0].total_users),
        players: parseInt(usersResult.rows[0].players),
        organizers: parseInt(usersResult.rows[0].organizers),
        admins: parseInt(usersResult.rows[0].admins),
        newThisWeek: parseInt(usersResult.rows[0].new_users_week),
        newThisMonth: parseInt(usersResult.rows[0].new_users_month)
      },
      tournaments: {
        total: parseInt(tournamentsResult.rows[0].total_tournaments),
        draft: parseInt(tournamentsResult.rows[0].draft),
        registration: parseInt(tournamentsResult.rows[0].registration),
        active: parseInt(tournamentsResult.rows[0].active),
        completed: parseInt(tournamentsResult.rows[0].completed),
        createdThisWeek: parseInt(tournamentsResult.rows[0].created_week),
        createdThisMonth: parseInt(tournamentsResult.rows[0].created_month)
      },
      matches: {
        total: parseInt(matchesResult.rows[0].total_matches),
        completed: parseInt(matchesResult.rows[0].completed_matches),
        pending: parseInt(matchesResult.rows[0].pending_matches),
        avgTotalCP: parseFloat(matchesResult.rows[0].avg_total_cp || 0).toFixed(1),
        avgTotalAP: parseFloat(matchesResult.rows[0].avg_total_ap || 0).toFixed(1)
      },
      engagement: {
        activePlayers: parseInt(engagementResult.rows[0].active_players),
        avgMatchesPerPlayer: parseFloat(engagementResult.rows[0].avg_matches_per_player || 0).toFixed(1)
      },
      gameSystems: gameSystemsResult.rows.map(row => ({
        name: row.game_system,
        count: parseInt(row.tournament_count)
      })),
      recentActivity: recentActivityResult.rows
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get system statistics'
    });
  }
};

/**
 * Get user details by ID (admin only)
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT
        id, email, username, role, first_name, last_name,
        avatar_url, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Get user's tournament statistics
    const statsResult = await pool.query(
      `SELECT
        COUNT(DISTINCT tp.tournament_id) as tournaments_participated,
        COUNT(DISTINCT CASE WHEN t.organizer_id = $1 THEN t.id END) as tournaments_organized
       FROM tournament_players tp
       LEFT JOIN tournaments t ON tp.tournament_id = t.id
       WHERE tp.player_id = $1 OR t.organizer_id = $1`,
      [userId]
    );

    res.json({
      user: result.rows[0],
      stats: {
        tournamentsParticipated: parseInt(statsResult.rows[0].tournaments_participated),
        tournamentsOrganized: parseInt(statsResult.rows[0].tournaments_organized)
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user details'
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats,
  getUserById
};
