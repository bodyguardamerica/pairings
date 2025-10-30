/**
 * Base Game Module Interface
 * All game systems should implement this interface
 */
class GameModule {
  constructor(name) {
    this.name = name;
  }

  /**
   * Calculate match score based on game-specific rules
   * @param {Object} matchResult - Raw match result data
   * @returns {Object} Processed match result with scores
   */
  calculateMatchScore(matchResult) {
    throw new Error('calculateMatchScore() must be implemented by game module');
  }

  /**
   * Calculate tournament standings with game-specific tiebreakers
   * @param {Array} players - Array of tournament players
   * @param {Array} matches - Array of completed matches
   * @returns {Array} Sorted standings
   */
  calculateStandings(players, matches) {
    throw new Error('calculateStandings() must be implemented by game module');
  }

  /**
   * Validate match result according to game rules
   * @param {Object} matchResult - Match result to validate
   * @returns {Object} { valid: boolean, errors: Array }
   */
  validateMatchResult(matchResult) {
    throw new Error('validateMatchResult() must be implemented by game module');
  }

  /**
   * Get available scenarios/missions for this game
   * @returns {Array} List of scenarios
   */
  getScenarios() {
    throw new Error('getScenarios() must be implemented by game module');
  }

  /**
   * Get scoring fields required for match results
   * @returns {Array} Array of field definitions
   */
  getScoringFields() {
    throw new Error('getScoringFields() must be implemented by game module');
  }

  /**
   * Format standings for display
   * @param {Object} standing - Standing record
   * @returns {Object} Formatted standing
   */
  formatStanding(standing) {
    throw new Error('formatStanding() must be implemented by game module');
  }
}

module.exports = GameModule;
