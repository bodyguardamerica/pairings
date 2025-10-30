import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import TournamentCard from '../../components/tournament/TournamentCard';
import DatePicker from '../../components/common/DatePicker';
import { tournamentAPI } from '../../services/api';
import { getUser } from '../../utils/auth';
import { getResponsiveStyle } from '../../utils/responsive';
import { validateTextInput } from '../../utils/profanityFilter';
import { useColors } from '../../hooks/useColors';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const TournamentListScreen = ({ navigation }) => {
  const themeColors = useColors();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [registeredTournamentIds, setRegisteredTournamentIds] = useState(new Set());
  const { isDesktop } = getResponsiveStyle();

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    gameSystem: 'all',
    rated: 'all',
    minPlayers: '',
    maxPlayers: '',
    city: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    loadUser();
    loadTournaments();
  }, []);

  const loadUser = async () => {
    const user = await getUser();
    setCurrentUser(user);
  };

  const loadTournaments = async () => {
    try {
      // Load ALL tournaments and filter client-side
      const response = await tournamentAPI.getAll({});
      const tournamentsData = response.tournaments || [];
      setTournaments(tournamentsData);

      // Check which tournaments the user is registered for
      if (currentUser) {
        const registeredIds = new Set();

        // Check each tournament for user registration
        for (const tournament of tournamentsData) {
          try {
            const playersData = await tournamentAPI.getPlayers(tournament.id);
            const isRegistered = playersData.players?.some(
              player => player.playerId === currentUser.id
            );
            if (isRegistered) {
              registeredIds.add(tournament.id);
            }
          } catch (error) {
            // Silently fail for individual tournament player checks
            console.log(`Could not load players for tournament ${tournament.id}`);
          }
        }

        setRegisteredTournamentIds(registeredIds);
      }
    } catch (error) {
      console.error('Error loading tournaments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTournaments();
  }, [filters]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // Clear error when typing
    if (searchError) {
      setSearchError('');
    }
  };

  const handleSearchBlur = () => {
    if (searchQuery) {
      const error = validateTextInput(searchQuery);
      setSearchError(error);
    }
  };

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const applyFilters = () => {
    setShowFilters(false);
    // No need to reload - filtering happens client-side
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      gameSystem: 'all',
      rated: 'all',
      minPlayers: '',
      maxPlayers: '',
      city: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    // "My Events" filter - show only events I created or am a co-organizer of
    if (filters.status === 'my-events' && currentUser) {
      const isOrganizer = tournament.organizer?.id === currentUser.id;
      const isCoOrganizer = tournament.coOrganizers && tournament.coOrganizers.includes(currentUser.id);
      if (!isOrganizer && !isCoOrganizer) {
        return false;
      }
    } else {
      // Regular status filter
      const matchesStatus = filters.status === 'all' || tournament.status === filters.status;
      if (!matchesStatus) return false;
    }

    // Game system filter
    const matchesGameSystem = filters.gameSystem === 'all' ||
      tournament.gameSystem === filters.gameSystem;

    // Rated filter
    const matchesRated = filters.rated === 'all' ||
      (filters.rated === 'rated' && tournament.isRated === true) ||
      (filters.rated === 'unrated' && tournament.isRated === false);

    // Search query filter
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location?.toLowerCase().includes(searchQuery.toLowerCase());

    // City filter
    const matchesCity = !filters.city ||
      tournament.location?.toLowerCase().includes(filters.city.toLowerCase());

    // Max players filter
    const matchesMinPlayers = !filters.minPlayers ||
      tournament.maxPlayers >= parseInt(filters.minPlayers);

    const matchesMaxPlayers = !filters.maxPlayers ||
      tournament.maxPlayers <= parseInt(filters.maxPlayers);

    // Date filters
    const tournamentDate = new Date(tournament.startDate);
    const matchesDateFrom = !filters.dateFrom ||
      tournamentDate >= new Date(filters.dateFrom);

    const matchesDateTo = !filters.dateTo ||
      tournamentDate <= new Date(filters.dateTo);

    return matchesGameSystem && matchesRated && matchesSearch && matchesCity &&
           matchesMinPlayers && matchesMaxPlayers && matchesDateFrom && matchesDateTo;
  });

  const statusFilters = [
    { label: 'All', value: 'all' },
    ...(currentUser ? [{ label: 'My Events', value: 'my-events' }] : []),
    { label: 'Open Registration', value: 'registration' },
    { label: 'In Progress', value: 'active' },
    { label: 'Completed', value: 'completed' },
  ];

  const gameSystemFilters = [
    { label: 'All Games', value: 'all' },
    { label: 'Warmachine', value: 'warmachine' },
  ];

  const ratedFilters = [
    { label: 'All Events', value: 'all' },
    { label: 'Rated Only', value: 'rated' },
    { label: 'Unrated Only', value: 'unrated' },
  ];

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'all').length;

  // All authenticated users can create tournaments
  const canCreateTournament = currentUser !== null;

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={[
              styles.searchInput,
              { backgroundColor: themeColors.bgSecondary, color: themeColors.textPrimary },
              searchError && styles.inputError
            ]}
            placeholder="Search events..."
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onBlur={handleSearchBlur}
          />
          {searchError && <Text style={[styles.errorText, { color: themeColors.error }]}>{searchError}</Text>}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: themeColors.primary }]}
          onPress={() => setShowFilters(true)}
        >
          <Text style={[styles.filterButtonText, { color: themeColors.white }]}>
            🔍 Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Filter Chips */}
      <View style={[styles.filtersContainer, { backgroundColor: themeColors.cardBg, borderBottomColor: themeColors.borderColor }]}>
        <View style={styles.filtersContent}>
          {statusFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                { backgroundColor: filters.status === filter.value ? themeColors.primary : themeColors.bgSecondary },
                filters.status === filter.value && styles.filterChipActive,
              ]}
              onPress={() => updateFilter('status', filter.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filters.status === filter.value ? themeColors.white : themeColors.textSecondary },
                  filters.status === filter.value && styles.filterChipTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.bgSecondary }]}>
      {/* Tournament List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : Platform.OS === 'web' ? (
        <ScrollView
          style={styles.flatList}
          contentContainerStyle={styles.webListContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {renderHeader()}
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((item) => (
              <TournamentCard
                key={item.id}
                tournament={item}
                onPress={() => navigation.navigate('TournamentDetails', { id: item.id })}
                isUserRegistered={registeredTournamentIds.has(item.id)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No events found</Text>
              <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
                {searchQuery || activeFilterCount > 0
                  ? 'Try adjusting your search or filters'
                  : 'Check back later for new events'}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <FlatList
          style={styles.flatList}
          data={filteredTournaments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TournamentCard
              tournament={item}
              onPress={() => navigation.navigate('TournamentDetails', { id: item.id })}
              isUserRegistered={registeredTournamentIds.has(item.id)}
            />
          )}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No events found</Text>
              <Text style={[styles.emptySubtext, { color: themeColors.textSecondary }]}>
                {searchQuery || activeFilterCount > 0
                  ? 'Try adjusting your search or filters'
                  : 'Check back later for new events'}
              </Text>
            </View>
          }
        />
      )}

      {/* Advanced Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Events</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Game System Filter */}
              <Text style={styles.filterLabel}>Game System</Text>
              <View style={styles.chipGroup}>
                {gameSystemFilters.map((filter, index) => (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.filterChip,
                      filters.gameSystem === filter.value && styles.filterChipActive,
                      index > 0 && { marginLeft: spacing.sm },
                      { marginBottom: spacing.sm },
                    ]}
                    onPress={() => updateFilter('gameSystem', filter.value)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.gameSystem === filter.value && styles.filterChipTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Rated Filter */}
              <Text style={styles.filterLabel}>Event Type</Text>
              <View style={styles.chipGroup}>
                {ratedFilters.map((filter, index) => (
                  <TouchableOpacity
                    key={filter.value}
                    style={[
                      styles.filterChip,
                      filters.rated === filter.value && styles.filterChipActive,
                      index > 0 && { marginLeft: spacing.sm },
                      { marginBottom: spacing.sm },
                    ]}
                    onPress={() => updateFilter('rated', filter.value)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.rated === filter.value && styles.filterChipTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* City Filter */}
              <Text style={styles.filterLabel}>City</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter city name"
                placeholderTextColor={colors.gray400}
                value={filters.city}
                onChangeText={(text) => updateFilter('city', text)}
              />

              {/* Max Players Filter */}
              <Text style={styles.filterLabel}>Number of Players</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={[styles.filterInput, styles.rangeInput]}
                  placeholder="Min"
                  placeholderTextColor={colors.gray400}
                  value={filters.minPlayers}
                  onChangeText={(text) => updateFilter('minPlayers', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.rangeSeparator}>to</Text>
                <TextInput
                  style={[styles.filterInput, styles.rangeInput]}
                  placeholder="Max"
                  placeholderTextColor={colors.gray400}
                  value={filters.maxPlayers}
                  onChangeText={(text) => updateFilter('maxPlayers', text)}
                  keyboardType="numeric"
                />
              </View>

              {/* Date Range Filter */}
              <Text style={styles.filterLabel}>Date Range</Text>
              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChangeDate={(date) => updateFilter('dateFrom', date)}
                placeholder="Select start date"
              />
              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChangeDate={(date) => updateFilter('dateTo', date)}
                placeholder="Select end date"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* FAB - Create Tournament */}
      {canCreateTournament && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: themeColors.primary }]}
          onPress={() => navigation.navigate('CreateTournament')}
        >
          <Text style={[styles.fabIcon, { color: themeColors.white }]}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.gray50,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.gray900,
    marginRight: spacing.sm,
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  filterButtonText: {
    color: colors.white,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  filtersContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.gray100,
    marginRight: spacing.md,
    marginBottom: spacing.sm,
    minWidth: 100,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.gray600,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  webListContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    minHeight: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: spacing.xl2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.medium,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.gray400,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 30,
    color: colors.white,
    fontWeight: typography.weights.bold,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.radiusLg,
    borderTopRightRadius: spacing.radiusLg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  modalTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.gray900,
  },
  closeButton: {
    fontSize: typography.sizes.xl2,
    color: colors.gray600,
    padding: spacing.xs,
  },
  modalBody: {
    padding: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterInput: {
    backgroundColor: colors.gray50,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.gray900,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  rangeSeparator: {
    color: colors.gray600,
    fontSize: typography.sizes.sm,
    marginHorizontal: spacing.xs,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  clearButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  clearButtonText: {
    color: colors.gray700,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  applyButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    color: colors.white,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default TournamentListScreen;
