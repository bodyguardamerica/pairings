import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OutlineButton } from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { getUser, removeToken } from '../../utils/auth';
import { playerAPI } from '../../services/api';
import { useColors } from '../../hooks/useColors';
import { useTheme } from '../../contexts/ThemeContext';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const colors = useColors();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getUser();
      setUser(userData);

      // Load player statistics
      if (userData?.id) {
        const statsData = await playerAPI.getStatistics(userData.id);
        setStats(statsData.statistics);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');

    // Use native confirm for web, Alert for mobile
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      console.log('Logout confirmed:', confirmed);

      if (confirmed) {
        console.log('Removing token...');
        await removeToken();
        console.log('Token removed, auth state should update automatically');
        // Navigation will be handled by AppNavigator checking auth state
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            console.log('Removing token...');
            await removeToken();
            console.log('Token removed, auth state should update automatically');
          },
        },
      ]);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: colors.bgSecondary,
    },
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={[styles.avatar, { backgroundColor: colors.white }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {user.firstName ? user.firstName[0] : user.username[0].toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.white }]}>
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username}
        </Text>
        <Text style={[styles.username, { color: colors.white }]}>@{user.username}</Text>
        {user.role === 'admin' && (
          <Badge
            text="ADMIN"
            status="error"
            style={styles.roleBadge}
          />
        )}
      </LinearGradient>

      {/* Statistics */}
      {stats && (
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Statistics</Text>

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.tournaments.played}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tournaments</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.matches.total}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Matches</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.matches.winRate.toFixed(1)}%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Win Rate</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {stats.matches.wins}-{stats.matches.losses}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Record</Text>
            </View>
          </View>

          {stats.averages && (
            <View style={[styles.averagesSection, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.subsectionTitle, { color: colors.textPrimary }]}>Averages</Text>
              <View style={styles.averageRow}>
                <Text style={[styles.averageLabel, { color: colors.textSecondary }]}>Control Points:</Text>
                <Text style={[styles.averageValue, { color: colors.textPrimary }]}>{stats.averages.controlPoints}</Text>
              </View>
              <View style={styles.averageRow}>
                <Text style={[styles.averageLabel, { color: colors.textSecondary }]}>Army Points:</Text>
                <Text style={[styles.averageValue, { color: colors.textPrimary }]}>{stats.averages.armyPoints}</Text>
              </View>
            </View>
          )}

          {stats.factions && stats.factions.length > 0 && (
            <View style={[styles.factionsSection, { backgroundColor: colors.cardBg }]}>
              <Text style={[styles.subsectionTitle, { color: colors.textPrimary }]}>Factions Played</Text>
              {stats.factions.map((faction, index) => (
                <View key={index} style={[styles.factionRow, { borderBottomColor: colors.borderColor }]}>
                  <Text style={[styles.factionName, { color: colors.textPrimary }]}>{faction.faction}</Text>
                  <Text style={[styles.factionCount, { color: colors.textSecondary }]}>{faction.times_played} games</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Recent Events */}
      {stats && stats.recentTournaments && stats.recentTournaments.length > 0 && (
        <View style={styles.eventsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Events</Text>
          {stats.recentTournaments.map((tournament, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.eventCard, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}
              onPress={() => navigation.navigate('TournamentDetails', { id: tournament.id })}
            >
              <View style={styles.eventHeader}>
                <Text style={[styles.eventName, { color: colors.textPrimary }]}>{tournament.name}</Text>
                <Badge
                  text={tournament.status}
                  status={
                    tournament.status === 'completed'
                      ? 'success'
                      : tournament.status === 'active'
                      ? 'warning'
                      : 'info'
                  }
                />
              </View>
              <View style={styles.eventDetails}>
                <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>
                  📅 {new Date(tournament.start_date).toLocaleDateString()}
                </Text>
                {tournament.faction && (
                  <Text style={[styles.eventDetailText, { color: colors.textSecondary }]}>⚔️ {tournament.faction}</Text>
                )}
                {tournament.dropped && (
                  <Text style={[styles.droppedText, { color: colors.error }]}>Dropped (Round {tournament.dropRound})</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Account Info */}
      <View style={styles.accountSection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account</Text>

        <View style={[styles.infoRow, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.email}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Role:</Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{user.role}</Text>
        </View>

        <View style={[styles.infoRow, { backgroundColor: colors.cardBg, borderColor: colors.borderColor }]}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Dark Mode:</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.gray200, true: colors.primary }}
            thumbColor={isDarkMode ? colors.white : colors.gray400}
          />
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <OutlineButton title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: typography.sizes.xl3,
    fontWeight: typography.weights.bold,
  },
  name: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  username: {
    fontSize: typography.sizes.base,
    opacity: 0.9,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    marginTop: spacing.xs,
  },
  statsSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    marginHorizontal: -spacing.xs,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    margin: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
  },
  averagesSection: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
  },
  subsectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.sm,
  },
  averageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  averageLabel: {
    fontSize: typography.sizes.sm,
  },
  averageValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  factionsSection: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  factionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  factionName: {
    fontSize: typography.sizes.sm,
  },
  factionCount: {
    fontSize: typography.sizes.sm,
  },
  eventsSection: {
    padding: spacing.lg,
  },
  eventCard: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eventName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    flex: 1,
    marginRight: spacing.sm,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  eventDetailText: {
    fontSize: typography.sizes.sm,
    marginRight: spacing.md,
  },
  droppedText: {
    fontSize: typography.sizes.sm,
    fontStyle: 'italic',
  },
  accountSection: {
    padding: spacing.lg,
  },
  infoRow: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
  },
  actionsSection: {
    padding: spacing.lg,
    paddingBottom: spacing.xl2,
  },
});

export default ProfileScreen;
