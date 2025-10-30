import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Badge from '../../components/common/Badge';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button';
import { tournamentAPI } from '../../services/api';
import { getUser } from '../../utils/auth';
import { useColors } from '../../hooks/useColors';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const TournamentDetailsScreen = ({ route, navigation }) => {
  const themeColors = useColors();
  const { id } = route.params;
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [currentUser, setCurrentUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [standings, setStandings] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [coOrganizers, setCoOrganizers] = useState([]);
  const [showAddCoOrganizer, setShowAddCoOrganizer] = useState(false);
  const [showTransferOwnership, setShowTransferOwnership] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // Reload data when screen comes into focus (e.g., after registration)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const user = await getUser();
      setCurrentUser(user);

      const tournamentData = await tournamentAPI.getById(id);
      setTournament(tournamentData.tournament);

      // Always load players to check registration status
      const playersData = await tournamentAPI.getPlayers(id);
      const playersList = playersData.players || [];
      setPlayers(playersList);

      // Check if current user is registered
      if (user) {
        const userRegistered = playersList.some(player => player.playerId === user.id);
        setIsRegistered(userRegistered);
      }

      if (activeTab === 'standings') {
        const standingsData = await tournamentAPI.getStandings(id);
        setStandings(standingsData.standings || []);
      }

      // Load co-organizers if viewing info tab
      if (activeTab === 'info') {
        try {
          const coOrgsData = await tournamentAPI.getCoOrganizers(id);
          setCoOrganizers(coOrgsData.coOrganizers || []);
        } catch (error) {
          console.error('Error loading co-organizers:', error);
        }
      }
    } catch (error) {
      console.error('Error loading tournament:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleRegister = () => {
    navigation.navigate('RegisterForTournament', { tournamentId: id });
  };

  const handleCreateRound = async () => {
    try {
      await tournamentAPI.createRound(id);
      // Reload tournament data to show new round
      loadData();
    } catch (error) {
      console.error('Error creating round:', error);
      alert(error.response?.data?.message || 'Failed to create round');
    }
  };

  const handleDeleteRound = (roundNumber) => {
    const confirmMessage = `Are you sure you want to delete Round ${roundNumber}? This will permanently delete all matches and results for this round. This action cannot be undone.`;
    const confirmTitle = 'Delete Round';

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        deleteRound(roundNumber);
      }
    } else {
      Alert.alert(
        confirmTitle,
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteRound(roundNumber),
          },
        ]
      );
    }
  };

  const deleteRound = async (roundNumber) => {
    try {
      await tournamentAPI.deleteRound(id, roundNumber);

      const message = `Round ${roundNumber} deleted successfully`;
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message);
      }

      // Reload data
      loadData();
    } catch (error) {
      console.error('Error deleting round:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete round';

      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await tournamentAPI.update(id, { status: newStatus });
      // Reload tournament data
      loadData();
    } catch (error) {
      console.error('Error updating tournament status:', error);
      alert(error.response?.data?.message || 'Failed to update tournament status');
    }
  };

  const handleCompleteTournament = () => {
    const confirmMessage = 'Are you sure you want to complete this tournament? This will finalize all results and close the event.';
    const confirmTitle = 'Complete Tournament';

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMessage)) {
        handleStatusChange('completed');
      }
    } else {
      Alert.alert(
        confirmTitle,
        confirmMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Complete',
            style: 'default',
            onPress: () => handleStatusChange('completed'),
          },
        ]
      );
    }
  };

  const handleUnregister = async (playerId) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to withdraw from this tournament?');
      if (!confirmed) return;
    } else {
      // For mobile, would use Alert.alert with confirmation
      return;
    }

    try {
      await tournamentAPI.unregisterPlayer(id, playerId);
      // Reload tournament data
      loadData();
    } catch (error) {
      console.error('Error unregistering:', error);
      alert(error.response?.data?.message || 'Failed to withdraw from tournament');
    }
  };

  const handleAddCoOrganizer = async (userId) => {
    try {
      await tournamentAPI.addCoOrganizer(id, userId);
      setShowAddCoOrganizer(false);
      setSearchQuery('');
      loadData();
    } catch (error) {
      console.error('Error adding co-organizer:', error);
      alert(error.response?.data?.message || 'Failed to add co-organizer');
    }
  };

  const handleRemoveCoOrganizer = async (userId) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Remove this co-organizer?');
      if (!confirmed) return;
    }

    try {
      await tournamentAPI.removeCoOrganizer(id, userId);
      loadData();
    } catch (error) {
      console.error('Error removing co-organizer:', error);
      alert(error.response?.data?.message || 'Failed to remove co-organizer');
    }
  };

  const handleTransferOwnership = async (newOwnerId) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to transfer ownership of this tournament? You will no longer be the main organizer.');
      if (!confirmed) return;
    }

    try {
      await tournamentAPI.transferOwnership(id, newOwnerId);
      setShowTransferOwnership(false);
      alert('Ownership transferred successfully!');
      loadData();
    } catch (error) {
      console.error('Error transferring ownership:', error);
      alert(error.response?.data?.message || 'Failed to transfer ownership');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tournament not found</Text>
      </View>
    );
  }

  // Check if user is main organizer or co-organizer
  const isMainOrganizer = currentUser && tournament.organizer.id === currentUser.id;
  const isCoOrganizer = currentUser && (tournament.coOrganizers || []).includes(currentUser.id);
  const isOrganizer = isMainOrganizer || isCoOrganizer;
  const isTournamentFull = tournament.playerCount >= tournament.maxPlayers;
  const canRegister =
    !isRegistered &&
    (tournament.status === 'registration' || tournament.status === 'draft') &&
    !isTournamentFull;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bgSecondary }]}>
      {/* Header */}
      <LinearGradient
        colors={[themeColors.gradientStart, themeColors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={[styles.title, { color: themeColors.white }]}>{tournament.name}</Text>
        <View style={styles.headerBadges}>
          <Badge text={tournament.status} status={tournament.status} />
          {tournament.isRated !== undefined && (
            <Badge
              text={tournament.isRated ? "rated" : "unrated"}
              status={tournament.isRated ? "rated" : "unrated"}
              style={styles.ratedBadge}
            />
          )}
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
        {['info', 'players', 'standings', 'rounds'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { borderBottomColor: themeColors.primary, borderBottomWidth: 3 }
            ]}
            onPress={() => {
              setActiveTab(tab);
              loadData();
            }}
          >
            <Text style={[
              styles.tabText,
              { color: activeTab === tab ? themeColors.primary : themeColors.textSecondary }
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={[styles.content, { backgroundColor: themeColors.bgSecondary }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={themeColors.primary} />
        }
      >
        {activeTab === 'info' && (
          <View style={styles.infoTab}>
            <View style={[styles.infoRow, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Game System:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>{tournament.gameSystem || 'Warmachine'}</Text>
            </View>

            <View style={[styles.infoRow, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Format:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>{tournament.format}</Text>
            </View>

            {tournament.location && (
              <View style={[styles.infoRow, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Location:</Text>
                <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>📍 {tournament.location}</Text>
              </View>
            )}

            <View style={[styles.infoRow, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Date:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>{formatDate(tournament.startDate)}</Text>
            </View>

            <View style={[styles.infoRow, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Players:</Text>
              <Text style={[styles.infoValue, { color: themeColors.textPrimary }]}>
                {tournament.playerCount}/{tournament.maxPlayers}
              </Text>
            </View>

            {tournament.description && (
              <View style={[styles.descriptionContainer, { backgroundColor: themeColors.cardBg }]}>
                <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Description:</Text>
                <Text style={[styles.description, { color: themeColors.textPrimary }]}>{tournament.description}</Text>
              </View>
            )}

            <View style={[styles.organizerContainer, { backgroundColor: themeColors.cardBg }]}>
              <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Organizer:</Text>
              <Text style={[styles.organizerName, { color: themeColors.textPrimary }]}>{tournament.organizer.username}</Text>
            </View>

            {/* Co-Organizers Section */}
            {(coOrganizers.length > 0 || isMainOrganizer) && (
              <View style={[styles.coOrganizersSection, { backgroundColor: themeColors.cardBg }]}>
                <View style={styles.coOrganizersHeader}>
                  <Text style={[styles.infoLabel, { color: themeColors.textSecondary }]}>Co-Organizers:</Text>
                  {isMainOrganizer && (
                    <TouchableOpacity
                      style={[styles.addButton, { backgroundColor: themeColors.primary }]}
                      onPress={() => setShowAddCoOrganizer(!showAddCoOrganizer)}
                    >
                      <Text style={[styles.addButtonText, { color: themeColors.white }]}>
                        {showAddCoOrganizer ? 'Cancel' : '+ Add'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {showAddCoOrganizer && isMainOrganizer && (
                  <View style={styles.addCoOrganizerForm}>
                    <Text style={styles.helpText}>
                      Select a registered player to add as co-organizer
                    </Text>
                    <View style={styles.playerSelectList}>
                      {players
                        .filter(p =>
                          p.playerId !== tournament.organizer.id &&
                          !coOrganizers.some(co => co.id === p.playerId)
                        )
                        .map((player) => (
                          <TouchableOpacity
                            key={player.playerId}
                            style={styles.playerSelectItem}
                            onPress={() => handleAddCoOrganizer(player.playerId)}
                          >
                            <Text style={styles.playerSelectName}>{player.username}</Text>
                            <Text style={styles.playerSelectAdd}>+</Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </View>
                )}

                {coOrganizers.length === 0 && !showAddCoOrganizer && (
                  <Text style={styles.noCoOrganizers}>No co-organizers added</Text>
                )}

                {coOrganizers.map((coOrg) => (
                  <View key={coOrg.id} style={styles.coOrganizerItem}>
                    <Text style={styles.coOrganizerName}>{coOrg.username}</Text>
                    {isMainOrganizer && (
                      <TouchableOpacity
                        onPress={() => handleRemoveCoOrganizer(coOrg.id)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {/* Transfer Ownership */}
                {isMainOrganizer && players.length > 0 && (
                  <View style={styles.transferOwnershipSection}>
                    <TouchableOpacity
                      style={styles.transferButton}
                      onPress={() => setShowTransferOwnership(!showTransferOwnership)}
                    >
                      <Text style={styles.transferButtonText}>
                        {showTransferOwnership ? 'Cancel Transfer' : 'Transfer Ownership'}
                      </Text>
                    </TouchableOpacity>

                    {showTransferOwnership && (
                      <View style={styles.transferOwnershipForm}>
                        <Text style={styles.helpText}>
                          Select a player to transfer tournament ownership to. You will become a co-organizer.
                        </Text>
                        <View style={styles.playerSelectList}>
                          {players
                            .filter(p => p.playerId !== tournament.organizer.id)
                            .map((player) => (
                              <TouchableOpacity
                                key={player.playerId}
                                style={styles.playerSelectItem}
                                onPress={() => handleTransferOwnership(player.playerId)}
                              >
                                <Text style={styles.playerSelectName}>{player.username}</Text>
                                <Text style={styles.playerSelectAdd}>→</Text>
                              </TouchableOpacity>
                            ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {isRegistered && (
              <View style={styles.registeredBanner}>
                <Text style={styles.registeredText}>✓ You are registered for this event</Text>
              </View>
            )}

            {canRegister && (
              <PrimaryButton title="Register for Event" onPress={handleRegister} />
            )}

            {!canRegister && !isRegistered && !isOrganizer && tournament.status === 'registration' && isTournamentFull && (
              <View style={styles.fullBanner}>
                <Text style={styles.fullText}>This event is full</Text>
              </View>
            )}

            {!canRegister && !isRegistered && !isOrganizer && tournament.status !== 'registration' && tournament.status !== 'draft' && (
              <View style={styles.closedBanner}>
                <Text style={styles.closedText}>Registration is closed</Text>
              </View>
            )}

            {isOrganizer && (
              <View style={styles.organizerActions}>
                {tournament.status === 'draft' && (
                  <PrimaryButton
                    title="Open Registration"
                    onPress={() => handleStatusChange('registration')}
                  />
                )}
                {tournament.status === 'registration' && (
                  <PrimaryButton
                    title="Create First Round & Start"
                    onPress={handleCreateRound}
                  />
                )}
                {tournament.status === 'active' && tournament.currentRound > 0 && (
                  <PrimaryButton
                    title="Complete Tournament"
                    onPress={handleCompleteTournament}
                  />
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'players' && (
          <View style={styles.playersTab}>
            {players.length === 0 ? (
              <Text style={styles.emptyText}>No players registered yet</Text>
            ) : (
              players.map((player, index) => (
                <View key={player.id} style={styles.playerCard}>
                  <View style={styles.playerInfo}>
                    <View style={styles.playerDetails}>
                      <Text style={styles.playerName}>{player.username}</Text>
                      <Text style={styles.playerFaction}>{player.faction}</Text>
                      {player.listName && (
                        <Text style={styles.playerList}>{player.listName}</Text>
                      )}
                    </View>
                    {currentUser && player.playerId === currentUser.id && tournament.status !== 'completed' && (
                      <View style={styles.playerActions}>
                        <SecondaryButton
                          title="Edit"
                          onPress={() => navigation.navigate('EditRegistration', { tournamentId: id })}
                        />
                        {tournament.status !== 'active' && (
                          <SecondaryButton
                            title="Withdraw"
                            onPress={() => handleUnregister(player.id)}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'standings' && (
          <View style={styles.standingsTab}>
            {standings.length === 0 ? (
              <Text style={styles.emptyText}>No standings available yet</Text>
            ) : (
              standings.map((standing, index) => (
                <View key={standing.playerId} style={styles.standingRow}>
                  <Text style={styles.standingRank}>#{standing.rank}</Text>
                  <View style={styles.standingInfo}>
                    <Text style={styles.standingName}>{standing.playerName}</Text>
                    <Text style={styles.standingRecord}>{standing.record}</Text>
                  </View>
                  <Text style={styles.standingPoints}>{standing.tournamentPoints} TP</Text>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'rounds' && (
          <View style={styles.roundsTab}>
            {tournament.currentRound === 0 ? (
              <View>
                <Text style={styles.emptyText}>No rounds created yet</Text>
                {isOrganizer && tournament.status === 'active' && (
                  <View style={styles.createRoundContainer}>
                    <PrimaryButton
                      title="Create First Round"
                      onPress={handleCreateRound}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View>
                {Array.from({ length: tournament.currentRound }, (_, i) => i + 1).map((roundNumber) => {
                  const isLatestRound = roundNumber === tournament.currentRound;
                  return (
                    <View key={roundNumber} style={styles.roundCardContainer}>
                      <TouchableOpacity
                        style={styles.roundCard}
                        onPress={() => navigation.navigate('RoundDetails', {
                          tournamentId: id,
                          roundNumber
                        })}
                      >
                        <Text style={styles.roundTitle}>Round {roundNumber}</Text>
                        <Text style={styles.roundArrow}>→</Text>
                      </TouchableOpacity>
                      {/* Delete button only for the latest round and only for organizers */}
                      {isOrganizer && isLatestRound && (
                        <TouchableOpacity
                          style={styles.deleteRoundButton}
                          onPress={() => handleDeleteRound(roundNumber)}
                        >
                          <Text style={styles.deleteRoundButtonText}>Delete</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
                {isOrganizer && tournament.status === 'active' && (
                  <View style={styles.createRoundContainer}>
                    <SecondaryButton
                      title={`Create Round ${tournament.currentRound + 1}`}
                      onPress={handleCreateRound}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
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
    marginBottom: spacing.sm,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  ratedBadge: {
    marginLeft: spacing.xs,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray100,
  },
  tab: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray600,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    flex: 1,
  },
  infoTab: {
    padding: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray600,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    color: colors.gray900,
  },
  descriptionContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray900,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  organizerContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.lg,
  },
  organizerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  organizerActions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  playersTab: {
    padding: spacing.lg,
  },
  playerCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  playerFaction: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  playerList: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  playerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  standingsTab: {
    padding: spacing.lg,
  },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  standingRank: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    width: 40,
  },
  standingInfo: {
    flex: 1,
  },
  standingName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  standingRecord: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
  standingPoints: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  roundsTab: {
    padding: spacing.lg,
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.gray400,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  registeredBanner: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  registeredText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  fullBanner: {
    backgroundColor: colors.warning,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  fullText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  closedBanner: {
    backgroundColor: colors.gray400,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  closedText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  roundCardContainer: {
    marginBottom: spacing.sm,
  },
  roundCard: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: spacing.radiusMd,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  roundArrow: {
    fontSize: typography.sizes.xl,
    color: colors.primary,
  },
  deleteRoundButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.error,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  deleteRoundButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  createRoundContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  coOrganizersSection: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  coOrganizersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusSm,
  },
  addButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  addCoOrganizerForm: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  playerSelectList: {
    maxHeight: 200,
  },
  playerSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.xs,
  },
  playerSelectName: {
    fontSize: typography.sizes.base,
    color: colors.gray900,
  },
  playerSelectAdd: {
    fontSize: typography.sizes.xl,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  noCoOrganizers: {
    fontSize: typography.sizes.sm,
    color: colors.gray400,
    fontStyle: 'italic',
  },
  coOrganizerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: spacing.radiusSm,
    marginBottom: spacing.xs,
  },
  coOrganizerName: {
    fontSize: typography.sizes.base,
    color: colors.gray900,
  },
  removeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  removeButtonText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    fontWeight: typography.weights.semibold,
  },
  transferOwnershipSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  transferButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  transferButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
  transferOwnershipForm: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.md,
  },
});

export default TournamentDetailsScreen;
