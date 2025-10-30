import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { validateTextInput } from '../../utils/profanityFilter';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error = null,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  style,
  validateContent = true, // Enable content filtering by default
  onValidationError = null, // Callback when validation fails
  onSubmitEditing = null, // Callback when Enter key is pressed
  returnKeyType = 'default', // Type of return key (go, done, next, etc.)
}, ref) => {
  const colors = useColors();
  const [contentError, setContentError] = useState(null);

  const handleChangeText = (text) => {
    // Clear content error when user types
    if (contentError) {
      setContentError(null);
    }

    onChangeText(text);
  };

  const handleBlur = () => {
    // Validate content on blur if enabled
    if (validateContent && value && !secureTextEntry) {
      const errorMessage = validateTextInput(value);
      if (errorMessage) {
        setContentError(errorMessage);
        if (onValidationError) {
          onValidationError(errorMessage);
        }
      }
    }
  };

  // Combine external error and content validation error
  const displayError = error || contentError;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: colors.borderColor,
            color: colors.textPrimary,
            backgroundColor: colors.cardBg,
          },
          displayError && { borderColor: colors.error },
          multiline && styles.multilineInput,
          !editable && { backgroundColor: colors.bgSecondary, color: colors.textSecondary },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
      {displayError && <Text style={[styles.errorText, { color: colors.error }]}>{displayError}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
    fontWeight: typography.weights.medium,
  },
  input: {
    width: '100%',
    padding: spacing.md,
    borderWidth: 2,
    borderRadius: spacing.radiusMd,
    fontSize: typography.sizes.base,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});

export default Input;
