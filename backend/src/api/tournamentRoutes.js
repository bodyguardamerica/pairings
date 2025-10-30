const express = require('express');
const router = express.Router();
const {
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
} = require('../core/tournaments/tournamentController');
const {
  createRound,
  getRound,
  submitMatchResult,
  getStandings,
  submitMatchResultValidation
} = require('../core/tournaments/roundController');
const {
  dropPlayer,
  unregisterPlayer,
  updatePlayerList,
  getPlayerStatistics,
  searchPlayers,
  updatePrivacySettings
} = require('../core/tournaments/playerController');
const {
  editMatchResult,
  deleteMatchResult,
  deleteRound
} = require('../core/tournaments/matchController');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validateContent } = require('../middleware/contentFilter');

/**
 * @route   POST /api/tournaments
 * @desc    Create a new tournament
 * @access  Private (All authenticated users)
 */
router.post(
  '/',
  authenticate,
  createTournamentValidation,
  validateContent(['name', 'description', 'location', 'city', 'venue']),
  createTournament
);

/**
 * @route   GET /api/tournaments
 * @desc    Get all tournaments (with optional filters)
 * @access  Public
 */
router.get('/', getTournaments);

/**
 * @route   GET /api/tournaments/:id
 * @desc    Get tournament by ID
 * @access  Public
 */
router.get('/:id', getTournamentById);

/**
 * @route   PUT /api/tournaments/:id
 * @desc    Update tournament
 * @access  Private (Organizer or Admin)
 */
router.put(
  '/:id',
  authenticate,
  updateTournamentValidation,
  validateContent(['name', 'description', 'location', 'city', 'venue']),
  updateTournament
);

/**
 * @route   DELETE /api/tournaments/:id
 * @desc    Delete tournament
 * @access  Private (Organizer or Admin)
 */
router.delete('/:id', authenticate, deleteTournament);

/**
 * @route   POST /api/tournaments/:id/register
 * @desc    Register current user for tournament
 * @access  Private
 */
router.post(
  '/:id/register',
  authenticate,
  validateContent(['listName', 'faction']),
  registerPlayerValidation,
  registerPlayer
);

/**
 * @route   GET /api/tournaments/:id/players
 * @desc    Get all players registered for tournament
 * @access  Public
 */
router.get('/:id/players', getTournamentPlayers);

/**
 * @route   POST /api/tournaments/:tournamentId/rounds
 * @desc    Create new round with pairings
 * @access  Private (Organizer or Admin)
 */
router.post('/:tournamentId/rounds', authenticate, createRound);

/**
 * @route   GET /api/tournaments/:tournamentId/rounds/:roundNumber
 * @desc    Get round details with matches
 * @access  Public
 */
router.get('/:tournamentId/rounds/:roundNumber', getRound);

/**
 * @route   POST /api/tournaments/matches/:matchId/result
 * @desc    Submit match result
 * @access  Private (Organizer, Admin, or Player in match)
 */
router.post(
  '/matches/:matchId/result',
  authenticate,
  submitMatchResultValidation,
  submitMatchResult
);

/**
 * @route   GET /api/tournaments/:tournamentId/standings
 * @desc    Get current tournament standings
 * @access  Public
 */
router.get('/:tournamentId/standings', getStandings);

/**
 * @route   POST /api/tournaments/:tournamentId/players/:playerId/drop
 * @desc    Drop player from tournament
 * @access  Private (Organizer, Admin, or Self)
 */
router.post('/:tournamentId/players/:playerId/drop', authenticate, dropPlayer);

/**
 * @route   DELETE /api/tournaments/:tournamentId/players/:playerId
 * @desc    Unregister player from tournament (before it starts)
 * @access  Private (Organizer, Admin, or Self)
 */
router.delete('/:tournamentId/players/:playerId', authenticate, unregisterPlayer);

/**
 * @route   PUT /api/tournaments/:tournamentId/players/:playerId
 * @desc    Update player list/faction
 * @access  Private (Player or Admin)
 */
router.put('/:tournamentId/players/:playerId', authenticate, validateContent(['listName', 'faction']), updatePlayerList);

/**
 * @route   PUT /api/tournaments/matches/:matchId/result
 * @desc    Edit match result
 * @access  Private (Organizer or Admin)
 */
router.put(
  '/matches/:matchId/result',
  authenticate,
  submitMatchResultValidation,
  editMatchResult
);

/**
 * @route   DELETE /api/tournaments/matches/:matchId/result
 * @desc    Delete match result (reset to pending)
 * @access  Private (Organizer or Admin)
 */
router.delete('/matches/:matchId/result', authenticate, deleteMatchResult);

/**
 * @route   DELETE /api/tournaments/:tournamentId/rounds/:roundNumber
 * @desc    Delete round and all its matches
 * @access  Private (Organizer or Admin)
 */
router.delete('/:tournamentId/rounds/:roundNumber', authenticate, deleteRound);

/**
 * @route   GET /api/players/search
 * @desc    Search for players by username or name
 * @access  Public
 */
router.get('/players/search', searchPlayers);

/**
 * @route   GET /api/players/:playerId/statistics
 * @desc    Get player statistics across all tournaments
 * @access  Public (with optional auth for privacy check)
 */
router.get('/players/:playerId/statistics', optionalAuth, getPlayerStatistics);

/**
 * @route   PUT /api/players/privacy
 * @desc    Update user privacy settings
 * @access  Private
 */
router.put('/players/privacy', authenticate, updatePrivacySettings);

/**
 * @route   GET /api/tournaments/:id/co-organizers
 * @desc    Get co-organizers for tournament
 * @access  Public
 */
router.get('/:id/co-organizers', getCoOrganizers);

/**
 * @route   POST /api/tournaments/:id/co-organizers
 * @desc    Add co-organizer to tournament
 * @access  Private (Main organizer or Admin)
 */
router.post('/:id/co-organizers', authenticate, addCoOrganizer);

/**
 * @route   DELETE /api/tournaments/:id/co-organizers/:userId
 * @desc    Remove co-organizer from tournament
 * @access  Private (Main organizer or Admin)
 */
router.delete('/:id/co-organizers/:userId', authenticate, removeCoOrganizer);

/**
 * @route   POST /api/tournaments/:id/transfer-ownership
 * @desc    Transfer tournament ownership to another user
 * @access  Private (Main organizer or Admin)
 */
router.post('/:id/transfer-ownership', authenticate, transferOwnership);

module.exports = router;
