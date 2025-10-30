import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const Badge = ({ text, status = 'default', style }) => {
  const colors = useColors();

  const getStatusStyle = () => {
    switch (status) {
      case 'draft':
        return { backgroundColor: colors.gray400 };
      case 'registration':
        return { backgroundColor: colors.info };
      case 'active':
        return { backgroundColor: colors.success };
      case 'completed':
        return { backgroundColor: colors.warning };
      case 'cancelled':
        return { backgroundColor: colors.error };
      case 'registered':
        return { backgroundColor: colors.success };
      case 'rated':
        return { backgroundColor: colors.gradientStart }; // Purple for rated
      case 'unrated':
        return { backgroundColor: colors.gray400 }; // Gray for unrated
      default:
        return { backgroundColor: colors.gray400 };
    }
  };

  const getDisplayText = () => {
    switch (status) {
      case 'registration':
        return 'Open Registration';
      case 'active':
        return 'In Progress';
      case 'registered':
        return 'Registered';
      case 'rated':
        return 'Rated';
      case 'unrated':
        return 'Unrated';
      default:
        return text;
    }
  };

  return (
    <View style={[styles.badge, getStatusStyle(), style]}>
      <Text style={[styles.badgeText, { color: colors.white }]}>{getDisplayText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
  },
});

export default Badge;
