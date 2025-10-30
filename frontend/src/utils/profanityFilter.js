/**
 * Profanity and hate speech filter for frontend
 * Provides real-time validation for text inputs
 */

// List of prohibited words and patterns
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

// Words that might appear in legitimate contexts
const contextSafeWords = [
  'bass', 'class', 'grass', 'pass', 'glass', 'mass', 'sass',
  'assistant', 'assassin', 'cassette', 'passionate', 'compass',
  'dickens', 'dickinson', 'predict', 'dedicate', 'medication',
  'assume', 'consumption', 'presume',
];

/**
 * Check if text contains profanity or hate speech
 * @param {string} text - The text to check
 * @returns {Object} - { isClean: boolean, message: string }
 */
export const checkProfanity = (text) => {
  if (!text || typeof text !== 'string') {
    return { isClean: true, message: '' };
  }

  const normalizedText = text.toLowerCase().trim();

  // Check each prohibited word
  for (const word of prohibitedWords) {
    // Create regex with word boundaries
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');

    if (wordRegex.test(normalizedText)) {
      // Check if it's a context-safe word
      const isSafeContext = contextSafeWords.some(safe =>
        normalizedText.includes(safe) && normalizedText.indexOf(safe) === normalizedText.indexOf(word)
      );

      if (!isSafeContext) {
        return {
          isClean: false,
          message: 'Please keep your content respectful and avoid inappropriate language.',
        };
      }
    }
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(.)\1{6,}/g, // Repeated characters (7+ times)
    /[^\w\s]{4,}/g, // Multiple special characters in a row (4+)
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 2) {
        return {
          isClean: false,
          message: 'Your input contains suspicious patterns. Please use normal text.',
        };
      }
    }
  }

  return { isClean: true, message: '' };
};

/**
 * Validate text input and return error message if invalid
 * @param {string} text - The text to validate
 * @returns {string} - Error message or empty string if valid
 */
export const validateTextInput = (text) => {
  const result = checkProfanity(text);
  return result.isClean ? '' : result.message;
};

/**
 * Clean/sanitize text by replacing profanity with asterisks
 * @param {string} text - The text to sanitize
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  for (const word of prohibitedWords) {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
    sanitized = sanitized.replace(wordRegex, (match) => '*'.repeat(match.length));
  }

  return sanitized;
};
