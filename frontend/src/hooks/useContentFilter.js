/**
 * Custom hook for content filtering in text inputs
 */

import { useState, useCallback } from 'react';
import { validateTextInput } from '../utils/profanityFilter';

/**
 * Hook to validate text input for profanity/hate speech
 * Returns validation function and error state
 */
export const useContentFilter = () => {
  const [errors, setErrors] = useState({});

  /**
   * Validate a single field
   * @param {string} fieldName - Name of the field being validated
   * @param {string} value - Value to validate
   * @returns {boolean} - True if valid, false if invalid
   */
  const validateField = useCallback((fieldName, value) => {
    const errorMessage = validateTextInput(value);

    if (errorMessage) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: errorMessage,
      }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }
  }, []);

  /**
   * Validate multiple fields at once
   * @param {Object} fields - Object with fieldName: value pairs
   * @returns {boolean} - True if all valid, false if any invalid
   */
  const validateFields = useCallback((fields) => {
    let allValid = true;
    const newErrors = {};

    Object.entries(fields).forEach(([fieldName, value]) => {
      if (value && typeof value === 'string') {
        const errorMessage = validateTextInput(value);
        if (errorMessage) {
          newErrors[fieldName] = errorMessage;
          allValid = false;
        }
      }
    });

    setErrors(newErrors);
    return allValid;
  }, []);

  /**
   * Clear error for a specific field
   * @param {string} fieldName - Name of the field to clear
   */
  const clearError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    validateField,
    validateFields,
    clearError,
    clearAllErrors,
    errors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
