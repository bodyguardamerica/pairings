/**
 * Validated Text Input Component
 * TextInput with built-in profanity filtering
 */

import React, { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { validateTextInput } from '../../utils/profanityFilter';
import { colors, typography, spacing } from '../../theme';

/**
 * ValidatedTextInput component with content filtering
 * @param {Object} props - Component props
 * @param {string} props.value - Current value
 * @param {Function} props.onChangeText - Change handler
 * @param {Function} props.onValidation - Optional validation callback (valid: boolean)
 * @param {boolean} props.validateOnBlur - Validate when field loses focus (default: true)
 * @param {boolean} props.validateOnChange - Validate on every change (default: false)
 * @param {string} props.errorStyle - Custom error text style
 * @param {Object} ...rest - All other TextInput props
 */
export const ValidatedTextInput = ({
  value,
  onChangeText,
  onValidation,
  validateOnBlur = true,
  validateOnChange = false,
  errorStyle,
  style,
  ...rest
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = (text) => {
    const errorMessage = validateTextInput(text);
    setError(errorMessage);

    if (onValidation) {
      onValidation(!errorMessage);
    }

    return !errorMessage;
  };

  const handleChangeText = (text) => {
    onChangeText(text);

    // Clear error when user starts typing
    if (error && text !== value) {
      setError('');
    }

    // Validate on change if enabled
    if (validateOnChange && text.trim()) {
      validate(text);
    }
  };

  const handleBlur = () => {
    setTouched(true);

    // Validate on blur if enabled
    if (validateOnBlur && value && value.trim()) {
      validate(value);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        {...rest}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        style={[
          style,
          error && touched && styles.inputError,
        ]}
      />
      {error && touched && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default ValidatedTextInput;
