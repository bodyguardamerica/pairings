import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '../../hooks/useColors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

export const PrimaryButton = ({ title, onPress, loading = false, disabled = false, style }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primaryButton, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[styles.primaryButtonText, { color: colors.white }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress, loading = false, disabled = false, style }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.secondaryButton, { backgroundColor: colors.primary }, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={[styles.secondaryButtonText, { color: colors.white }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export const OutlineButton = ({ title, onPress, loading = false, disabled = false, style }) => {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.outlineButton,
        { borderColor: colors.primary, backgroundColor: colors.cardBg },
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={[styles.outlineButtonText, { color: colors.primary }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  secondaryButton: {
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  secondaryButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  outlineButton: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  outlineButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});
