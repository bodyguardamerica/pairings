import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  RefreshControl,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton, OutlineButton } from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { adminAPI } from '../../services/api';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const AdminDashboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats' or 'users'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, [activeTab, roleFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'stats') {
        await loadStats();
      } else {
        await loadUsers();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await adminAPI.getSystemStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
      throw error;
    }
  };

  const loadUsers = async () => {
    try {
      const params = {};
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const usersData = await adminAPI.getAllUsers(params);
      setUsers(usersData.users);
    } catch (error) {
      console.error('Error loading users:', error);
      throw error;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = () => {
    loadUsers();
  };

  const handleUpdateRole = (userId, currentRole) => {
    const roles = ['player', 'to', 'admin'];
    const roleLabels = { player: 'Player', to: 'Tournament Organizer', admin: 'Admin' };

    if (Platform.OS === 'web') {
      const newRole = prompt(
        `Select new role for user:\n1 - Player\n2 - Tournament Organizer\n3 - Admin\n\nEnter number (1-3):`,
        currentRole === 'player' ? '1' : currentRole === 'to' ? '2' : '3'
      );

      if (newRole) {
        const roleIndex = parseInt(newRole) - 1;
        if (roleIndex >= 0 && roleIndex < roles.length) {
          updateUserRole(userId, roles[roleIndex]);
        }
      }
    } else {
      Alert.alert(
        'Update Role',
        'Select new role:',
        roles.map((role) => ({
          text: roleLabels[role],
          onPress: () => updateUserRole(userId, role),
        })).concat([{ text: 'Cancel', style: 'cancel' }])
      );
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      Alert.alert('Success', 'User role updated successfully');
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = (userId, username) => {
    const message = `Are you sure you want to delete user "${username}"? This action cannot be undone.`;

    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        deleteUser(userId);
      }
    } else {
      Alert.alert('Delete User', message, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteUser(userId),
        },
      ]);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      Alert.alert('Success', 'User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to delete user');
    }
  };

  const renderStatsTab = () => {
    if (!stats) return null;

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.users.total}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.tournaments.total}</Text>
              <Text style={styles.statLabel}>Tournaments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.matches.total}</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.engagement.activePlayers}</Text>
              <Text style={styles.statLabel}>Active Players</Text>
            </View>
          </View>
        </View>

        {/* User Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users by Role</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Players:</Text>
              <Text style={styles.infoValue}>{stats.users.players}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tournament Organizers:</Text>
              <Text style={styles.infoValue}>{stats.users.organizers}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Admins:</Text>
              <Text style={styles.infoValue}>{stats.users.admins}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>New This Week:</Text>
              <Text style={[styles.infoValue, styles.successText]}>{stats.users.newThisWeek}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>New This Month:</Text>
              <Text style={[styles.infoValue, styles.successText]}>{stats.users.newThisMonth}</Text>
            </View>
          </View>
        </View>

        {/* Tournament Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Status</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Draft:</Text>
              <Badge text={stats.tournaments.draft.toString()} status="info" />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Registration:</Text>
              <Badge text={stats.tournaments.registration.toString()} status="warning" />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Active:</Text>
              <Badge text={stats.tournaments.active.toString()} status="success" />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Completed:</Text>
              <Badge text={stats.tournaments.completed.toString()} status="default" />
            </View>
          </View>
        </View>

        {/* Match Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Statistics</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Completed Matches:</Text>
              <Text style={styles.infoValue}>{stats.matches.completed}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pending Matches:</Text>
              <Text style={styles.infoValue}>{stats.matches.pending}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Avg CP per Match:</Text>
              <Text style={styles.infoValue}>{stats.matches.avgTotalCP}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Avg AP per Match:</Text>
              <Text style={styles.infoValue}>{stats.matches.avgTotalAP}</Text>
            </View>
          </View>
        </View>

        {/* Game Systems */}
        {stats.gameSystems && stats.gameSystems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Game Systems</Text>
            <View style={styles.infoCard}>
              {stats.gameSystems.map((system, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{system.name}:</Text>
                  <Text style={styles.infoValue}>{system.count} tournaments</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderUsersTab = () => {
    return (
      <View style={styles.tabContent}>
        {/* Search and Filters */}
        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by username or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {['all', 'player', 'to', 'admin'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, roleFilter === filter && styles.filterChipActive]}
                onPress={() => setRoleFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    roleFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter === 'all' ? 'All' : filter === 'to' ? 'TO' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Users List */}
        <ScrollView
          style={styles.usersList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.username}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                <Badge
                  text={user.role === 'to' ? 'TO' : user.role.toUpperCase()}
                  status={
                    user.role === 'admin' ? 'error' : user.role === 'to' ? 'warning' : 'default'
                  }
                />
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleUpdateRole(user.id, user.role)}
                >
                  <Text style={styles.actionButtonText}>Change Role</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteUser(user.id, user.username)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {users.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            User Management
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'stats' ? renderStatsTab() : renderUsersTab()}
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
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    color: colors.white,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
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
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray600,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    margin: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
  },
  infoValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  successText: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginVertical: spacing.sm,
  },
  searchSection: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: spacing.radiusSm,
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  searchButton: {
    backgroundColor: colors.primary,
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusSm,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: typography.weights.semibold,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusLg,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    fontWeight: typography.weights.medium,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
  },
  userActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  deleteButton: {
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.base,
    color: colors.gray600,
  },
});

export default AdminDashboardScreen;
