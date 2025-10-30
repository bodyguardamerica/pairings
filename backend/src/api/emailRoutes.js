const express = require('express');
const router = express.Router();
const {
  getEmailPreferences,
  upsertEmailPreference,
  deleteEmailPreference,
  disableAllAlerts
} = require('../core/email/emailPreferencesController');
const { authenticate } = require('../middleware/auth');

/**
 * @route   GET /api/email-preferences
 * @desc    Get user's email preferences
 * @access  Private
 */
router.get('/', authenticate, getEmailPreferences);

/**
 * @route   POST /api/email-preferences
 * @desc    Create or update email preference
 * @access  Private
 */
router.post('/', authenticate, upsertEmailPreference);

/**
 * @route   PUT /api/email-preferences
 * @desc    Create or update email preference (alias for POST)
 * @access  Private
 */
router.put('/', authenticate, upsertEmailPreference);

/**
 * @route   DELETE /api/email-preferences/:id
 * @desc    Delete email preference
 * @access  Private
 */
router.delete('/:id', authenticate, deleteEmailPreference);

/**
 * @route   POST /api/email-preferences/disable-all
 * @desc    Disable all email alerts
 * @access  Private
 */
router.post('/disable-all', authenticate, disableAllAlerts);

module.exports = router;
