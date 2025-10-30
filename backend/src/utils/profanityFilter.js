/**
 * Profanity and hate speech filter
 * Checks text for inappropriate content
 */

// List of prohibited words and patterns
// This is a basic list - in production, consider using a comprehensive library
const prohibitedWords = [
  // Common profanity
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'crap', 'piss', 'dick', 'cock', 'pussy',
  'bastard', 'slut', 'whore', 'faggot', 'nigger', 'nigga', 'retard', 'cunt',

  // Hate speech terms
  'nazi', 'hitler', 'kkk', 'kike', 'spic', 'chink', 'gook', 'towelhead',

  // Variations with special characters
  'f u c k', 'f*ck', 'f**k', 'sh!t', 'sh*t', 'b!tch', 'b*tch',
  'a$$', '@$$', 'd!ck', 'd*ck', 'n!gger', 'n*gger',

  // L33t speak variations
  'fuk', 'fck', 'shyt', 'b1tch', 'azz', 'd1ck', 'n1gger',
];

// Words that might appear in legitimate contexts (e.g., "Scunthorpe problem")
// We'll use word boundary matching to avoid false positives
const contextSafeWords = [
  'bass', 'class', 'grass', 'pass', 'glass', 'mass', 'sass',
  'assistant', 'assassin', 'cassette', 'passionate', 'compass',
  'dickens', 'dickinson', 'predict', 'dedicate', 'medication',
  'assume', 'consumption', 'presume',
];

/**
 * Check if text contains profanity or hate speech
 * @param {string} text - The text to check
 * @returns {Object} - { isClean: boolean, flaggedWords: string[] }
 */
const checkProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return { isClean: true, flaggedWords: [] };
  }

  const normalizedText = text.toLowerCase().trim();
  const flaggedWords = [];

  // Check each prohibited word
  for (const word of prohibitedWords) {
    // Escape special regex characters for word boundary matching
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // For the spaced pattern, we need to escape each character individually
    const spacedPattern = word.split('').map(char => {
      // Escape special regex characters
      const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return escaped;
    }).join('[\\s\\*\\!\\@\\#]*');

    // Create regex with word boundaries to avoid false positives
    // But also check for the word with spaces/special chars around it
    const wordRegex = new RegExp(`\\b${escapedWord}\\b|${spacedPattern}`, 'gi');

    if (wordRegex.test(normalizedText)) {
      // Check if it's a context-safe word
      const isSafeContext = contextSafeWords.some(safe =>
        normalizedText.includes(safe) && normalizedText.indexOf(safe) === normalizedText.indexOf(word)
      );

      if (!isSafeContext && !flaggedWords.includes(word)) {
        flaggedWords.push(word);
      }
    }
  }

  // Additional pattern checks for bypassing attempts
  const bypassPatterns = [
    /(.)\1{5,}/g, // Repeated characters (aaaaaaa)
    /[^\w\s]{3,}/g, // Multiple special characters in a row
  ];

  // Check for excessive special characters or repeated chars (common bypass attempts)
  for (const pattern of bypassPatterns) {
    if (pattern.test(text)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 2) {
        flaggedWords.push('[suspicious pattern]');
        break;
      }
    }
  }

  return {
    isClean: flaggedWords.length === 0,
    flaggedWords,
  };
};

/**
 * Sanitize text by removing profanity (replace with asterisks)
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  for (const word of prohibitedWords) {
    // Escape special regex characters
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    sanitized = sanitized.replace(wordRegex, (match) => '*'.repeat(match.length));
  }

  return sanitized;
};

/**
 * Validate text and throw error if profanity detected
 * @param {string} text - The text to validate
 * @param {string} fieldName - Name of the field being validated
 * @throws {Error} - If profanity is detected
 */
const validateText = (text, fieldName = 'Text') => {
  const result = checkProfanity(text);

  if (!result.isClean) {
    throw new Error(`${fieldName} contains inappropriate language. Please keep content respectful.`);
  }

  return true;
};

module.exports = {
  checkProfanity,
  sanitizeText,
  validateText,
  prohibitedWords, // Export for testing purposes
};
