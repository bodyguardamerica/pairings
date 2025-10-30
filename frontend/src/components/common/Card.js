import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../../hooks/useColors';
import spacing from '../../constants/spacing';

const Card = ({ children, onPress, style }) => {
  const colors = useColors();

  const cardStyle = [
    styles.card,
    { backgroundColor: colors.cardBg, shadowColor: colors.black },
    style
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export default Card;
