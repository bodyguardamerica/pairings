import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useColors } from '../../hooks/useColors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const TournamentCard = ({ tournament, onPress, isUserRegistered = false }) => {
  const colors = useColors();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
            {tournament.name}
          </Text>
          <Text style={[styles.game, { color: colors.primary }]}>{tournament.gameSystem || 'Warmachine'}</Text>
        </View>
        <View style={styles.badges}>
          {isUserRegistered && (
            <Badge text="registered" status="registered" style={styles.registeredBadge} />
          )}
          <Badge text={tournament.status} status={tournament.status} />
          {tournament.isRated !== undefined && (
            <Badge
              text={tournament.isRated ? "rated" : "unrated"}
              status={tournament.isRated ? "rated" : "unrated"}
            />
          )}
        </View>
      </View>

      <View style={styles.info}>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>📅 {formatDate(tournament.startDate)}</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>⏰ {formatTime(tournament.startDate)}</Text>
      </View>

      {tournament.location && (
        <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
          📍 {tournament.location}
        </Text>
      )}

      <View style={[styles.footer, { borderTopColor: colors.borderColor }]}>
        <Text style={[styles.players, { color: colors.textSecondary }]}>
          👥 {tournament.playerCount || 0}/{tournament.maxPlayers} players
        </Text>
        {tournament.organizer && (
          <Text style={[styles.organizer, { color: colors.textSecondary }]} numberOfLines={1}>
            TO: {tournament.organizer.username}
          </Text>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  game: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  info: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sizes.sm,
  },
  location: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  players: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  organizer: {
    fontSize: typography.sizes.xs,
    flex: 1,
    textAlign: 'right',
  },
  badges: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  registeredBadge: {
    marginBottom: spacing.xs,
  },
});

export default TournamentCard;
