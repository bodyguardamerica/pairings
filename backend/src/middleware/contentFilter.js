/**
 * Middleware for filtering inappropriate content in request bodies
 */

const { validateText } = require('../utils/profanityFilter');

/**
 * Validate specific fields in request body for profanity
 * @param {Array<string>} fields - Array of field names to validate
 * @returns {Function} - Express middleware function
 */
const validateContent = (fields = []) => {
  return (req, res, next) => {
    try {
      // If no specific fields provided, check common text fields
      const fieldsToCheck = fields.length > 0 ? fields : [
        'name',
        'title',
        'description',
        'message',
        'content',
        'comment',
        'bio',
        'username',
        'location',
        'city',
        'venue',
        'notes',
      ];

      // Check each field in the request body
      for (const field of fieldsToCheck) {
        if (req.body[field]) {
          // Get the field value
          const value = req.body[field];

          // Skip if not a string
          if (typeof value !== 'string') continue;

          // Validate the field
          validateText(value, field.charAt(0).toUpperCase() + field.slice(1));
        }
      }

      // All checks passed
      next();
    } catch (error) {
      // Profanity detected
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      });
    }
  };
};

/**
 * Validate all string fields in nested objects
 * @param {Object} obj - Object to validate
 * @param {string} path - Current path for error messages
 */
const validateAllStrings = (obj, path = '') => {
  if (typeof obj === 'string') {
    validateText(obj, path || 'Text');
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      validateAllStrings(item, `${path}[${index}]`);
    });
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      validateAllStrings(obj[key], path ? `${path}.${key}` : key);
    });
  }
};

/**
 * Deep validation of all strings in request body
 * Use this for comprehensive checking
 */
const validateAllContent = () => {
  return (req, res, next) => {
    try {
      validateAllStrings(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Bad Request',
        message: error.message,
      });
    }
  };
};

module.exports = {
  validateContent,
  validateAllContent,
};
