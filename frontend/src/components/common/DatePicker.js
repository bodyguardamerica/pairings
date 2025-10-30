import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const DatePicker = ({ label, value, onChangeDate, error, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event) => {
    if (Platform.OS === 'web') {
      const date = event.target.value;
      onChangeDate(date);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {Platform.OS === 'web' ? (
        <input
          type="date"
          value={value}
          onChange={handleDateChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: spacing.md,
            fontSize: typography.sizes.base,
            color: colors.gray900,
            backgroundColor: colors.gray50,
            borderRadius: spacing.radiusMd,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.gray200,
            borderStyle: 'solid',
            fontFamily: 'system-ui',
            boxSizing: 'border-box',
          }}
        />
      ) : (
        <TouchableOpacity
          style={[styles.input, error && styles.inputError]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={value ? styles.valueText : styles.placeholderText}>
            {value ? formatDateForDisplay(value) : placeholder || 'Select date'}
          </Text>
        </TouchableOpacity>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray700,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.gray50,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray200,
    justifyContent: 'center',
  },
  inputError: {
    borderColor: colors.error,
  },
  valueText: {
    fontSize: typography.sizes.base,
    color: colors.gray900,
  },
  placeholderText: {
    fontSize: typography.sizes.base,
    color: colors.gray400,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default DatePicker;
