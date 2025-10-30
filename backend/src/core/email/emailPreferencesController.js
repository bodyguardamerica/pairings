const { pool } = require('../../config/database');

/**
 * Get user's email preferences
 */
const getEmailPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, alert_type, enabled, filters, frequency, created_at, updated_at
       FROM email_preferences
       WHERE user_id = $1
       ORDER BY alert_type`,
      [userId]
    );

    res.json({
      preferences: result.rows.map(pref => ({
        id: pref.id,
        alertType: pref.alert_type,
        enabled: pref.enabled,
        filters: pref.filters,
        frequency: pref.frequency,
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }))
    });
  } catch (error) {
    console.error('Get email preferences error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch email preferences'
    });
  }
};

/**
 * Create or update email preference
 */
const upsertEmailPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { alertType, enabled, filters, frequency } = req.body;

    if (!alertType) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'alertType is required'
      });
    }

    // Validate alert type
    const validAlertTypes = ['new_event', 'event_update', 'round_start', 'result_submitted', 'tournament_reminder'];
    if (!validAlertTypes.includes(alertType)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `alertType must be one of: ${validAlertTypes.join(', ')}`
      });
    }

    // Validate frequency
    const validFrequencies = ['immediate', 'daily', 'weekly'];
    if (frequency && !validFrequencies.includes(frequency)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `frequency must be one of: ${validFrequencies.join(', ')}`
      });
    }

    // Insert or update preference
    const result = await pool.query(
      `INSERT INTO email_preferences (user_id, alert_type, enabled, filters, frequency)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, alert_type)
       DO UPDATE SET
         enabled = EXCLUDED.enabled,
         filters = EXCLUDED.filters,
         frequency = EXCLUDED.frequency,
         updated_at = NOW()
       RETURNING *`,
      [
        userId,
        alertType,
        enabled !== undefined ? enabled : true,
        filters ? JSON.stringify(filters) : null,
        frequency || 'immediate'
      ]
    );

    const pref = result.rows[0];

    res.json({
      message: 'Email preference saved successfully',
      preference: {
        id: pref.id,
        alertType: pref.alert_type,
        enabled: pref.enabled,
        filters: pref.filters,
        frequency: pref.frequency,
        createdAt: pref.created_at,
        updatedAt: pref.updated_at
      }
    });
  } catch (error) {
    console.error('Upsert email preference error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to save email preference'
    });
  }
};

/**
 * Delete email preference
 */
const deleteEmailPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify the preference belongs to the user
    const checkResult = await pool.query(
      'SELECT user_id FROM email_preferences WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Email preference not found'
      });
    }

    if (checkResult.rows[0].user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You cannot delete this preference'
      });
    }

    await pool.query('DELETE FROM email_preferences WHERE id = $1', [id]);

    res.json({
      message: 'Email preference deleted successfully'
    });
  } catch (error) {
    console.error('Delete email preference error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete email preference'
    });
  }
};

/**
 * Disable all email alerts for user
 */
const disableAllAlerts = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      'UPDATE email_preferences SET enabled = false WHERE user_id = $1',
      [userId]
    );

    res.json({
      message: 'All email alerts disabled successfully'
    });
  } catch (error) {
    console.error('Disable all alerts error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to disable alerts'
    });
  }
};

module.exports = {
  getEmailPreferences,
  upsertEmailPreference,
  deleteEmailPreference,
  disableAllAlerts
};
