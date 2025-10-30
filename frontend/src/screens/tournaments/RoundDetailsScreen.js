import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { tournamentAPI, matchAPI } from '../../services/api';
import { getUser } from '../../utils/auth';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const RoundDetailsScreen = ({ route, navigation }) => {
  const { tournamentId, roundNumber } = route.params;
  const [round, setRound] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);

      // Load tournament data to check organizer status
      const tournamentData = await tournamentAPI.getById(tournamentId);
      setTournament(tournamentData.tournament);

      const roundData = await tournamentAPI.getRound(tournamentId, roundNumber);
      setRound(roundData.round);
      setMatches(roundData.matches || []);
    } catch (error) {
      console.error('Error loading round:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeleteResult = (matchId) => {
    const confirmMessage = 'Are you sure you want to clear this match result? This will reset the match to pending status.';
    const confirmTitle = 'Clear Match Result';

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        deleteMatchResult(matchId);
      }
    } else {
      Alert.alert(
        confirmTitle,
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => deleteMatchResult(matchId),
          },
        ]
      );
    }
  };

  const deleteMatchResult = async (matchId) => {
    try {
      await matchAPI.deleteResult(matchId);

      const message = 'Match result cleared successfully';
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message);
      }

      // Reload data
      loadData();
    } catch (error) {
      console.error('Error deleting match result:', error);
      const errorMessage = error.response?.data?.message || 'Failed to clear match result';

      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const getMatchStatus = (match) => {
    if (match.status === 'completed') return 'Completed';
    if (match.status === 'bye') return 'BYE';
    return 'Pending';
  };

  const getVictoryIcon = (resultType) => {
    const icons = {
      scenario: '🎯',
      assassination: '⚔️',
      timeout: '⏱️',
      concession: '🏳️',
    };
    return icons[resultType] || '';
  };

  const getVictoryLabel = (resultType) => {
    const labels = {
      scenario: 'Scenario',
      assassination: 'Assassination',
      timeout: 'Timeout',
      concession: 'Concession',
    };
    return labels[resultType] || '';
  };

  const getMatchStatusColor = (match) => {
    if (match.status === 'completed') return colors.success;
    if (match.status === 'bye') return colors.gray400;
    return colors.warning;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!round) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Round not found</Text>
      </View>
    );
  }

  // Check if current user is organizer or co-organizer
  const isOrganizer = tournament && currentUser && (
    tournament.organizer.id === currentUser.id ||
    (tournament.coOrganizers && tournament.coOrganizers.includes(currentUser.id))
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Round {roundNumber}</Text>
        <Text style={styles.subtitle}>{matches.length} matches</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {matches.length === 0 ? (
          <Text style={styles.emptyText}>No matches in this round</Text>
        ) : (
          matches.map((match) => {
            const showOrganizerActions = match.status === 'completed' && isOrganizer;
            const isPlayer =
              match.player1?.playerId === currentUser?.id ||
              match.player2?.playerId === currentUser?.id;
            const canSubmitResult = match.status !== 'completed' && (isPlayer || currentUser?.role === 'admin');

            return (
              <View key={match.id} style={styles.matchCard}>
                <TouchableOpacity
                  style={styles.matchContent}
                  onPress={() => {
                    if (canSubmitResult) {
                      navigation.navigate('SubmitResult', {
                        matchId: match.id,
                        tournamentId,
                        roundNumber,
                      });
                    }
                  }}
                  activeOpacity={canSubmitResult ? 0.7 : 1}
                  disabled={!canSubmitResult}
                >
                  <View style={styles.matchHeader}>
                    <Text style={styles.tableNumber}>Table {match.tableNumber || '?'}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getMatchStatusColor(match) }]}>
                      <Text style={styles.statusText}>{getMatchStatus(match)}</Text>
                    </View>
                  </View>

                  {match.status === 'bye' ? (
                    <View style={styles.byeContainer}>
                      <Text style={styles.playerName}>
                        {match.player1?.username || 'Unknown Player'}
                      </Text>
                      <Text style={styles.byeText}>receives a BYE</Text>
                    </View>
                  ) : (
                    <View style={styles.matchup}>
                      <View style={[styles.player, match.winnerId === match.player1?.id && styles.winner]}>
                        <Text style={styles.playerName}>
                          {match.player1?.username || 'Unknown Player'}
                        </Text>
                        <Text style={styles.faction}>{match.player1?.faction || ''}</Text>
                        {match.status === 'completed' && (
                          <View style={styles.scoreContainer}>
                            <Text style={styles.scoreLabel}>CP: {match.player1?.controlPoints || 0}</Text>
                            <Text style={styles.scoreLabel}>AP: {match.player1?.armyPoints || 0}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.vs}>vs</Text>

                      <View style={[styles.player, match.winnerId === match.player2?.id && styles.winner]}>
                        <Text style={styles.playerName}>
                          {match.player2?.username || 'Unknown Player'}
                        </Text>
                        <Text style={styles.faction}>{match.player2?.faction || ''}</Text>
                        {match.status === 'completed' && (
                          <View style={styles.scoreContainer}>
                            <Text style={styles.scoreLabel}>CP: {match.player2?.controlPoints || 0}</Text>
                            <Text style={styles.scoreLabel}>AP: {match.player2?.armyPoints || 0}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  {match.scenario && (
                    <Text style={styles.scenario}>Scenario: {match.scenario}</Text>
                  )}
                </TouchableOpacity>

                {/* Edit and Delete buttons for organizers on completed matches */}
                {showOrganizerActions && (
                  <View style={styles.organizerActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        navigation.navigate('SubmitResult', {
                          matchId: match.id,
                          tournamentId,
                          roundNumber,
                        });
                      }}
                    >
                      <Text style={styles.editButtonText}>Edit Result</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteResult(match.id)}
                    >
                      <Text style={styles.deleteButtonText}>Clear Result</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.error,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.gray400,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  matchCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  matchContent: {
    padding: spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tableNumber: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.radiusSm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.white,
    textTransform: 'uppercase',
  },
  byeContainer: {
    alignItems: 'center',
    padding: spacing.md,
  },
  byeText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  matchup: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  player: {
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.gray50,
  },
  winner: {
    backgroundColor: colors.success + '20',
    borderWidth: 2,
    borderColor: colors.success,
  },
  playerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  faction: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  vs: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray400,
    textAlign: 'center',
    marginVertical: spacing.xs,
  },
  scoreContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  scoreLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
  },
  scenario: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  organizerActions: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingTop: 0,
  },
  editButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.info,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  editButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  deleteButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.error,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});

export default RoundDetailsScreen;
