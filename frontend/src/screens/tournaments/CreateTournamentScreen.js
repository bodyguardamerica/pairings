import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton, OutlineButton } from '../../components/common/Button';
import Input from '../../components/common/Input';
import DatePicker from '../../components/common/DatePicker';
import { tournamentAPI } from '../../services/api';
import { getResponsiveStyle } from '../../utils/responsive';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

// CreateTournamentScreen component
const CreateTournamentScreen = ({ navigation }) => {
  const { isDesktop } = getResponsiveStyle();
  const [formData, setFormData] = useState({
    name: '',
    gameSystem: 'warmachine',
    status: 'registration',
    isRated: true,
    city: '',
    location: '',
    maxPlayers: '',
    totalRounds: '',
    startDate: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Venue/location is required';
    }

    if (!formData.maxPlayers) {
      newErrors.maxPlayers = 'Max players is required';
    } else if (parseInt(formData.maxPlayers) < 4) {
      newErrors.maxPlayers = 'Must have at least 4 players';
    }

    if (!formData.totalRounds) {
      newErrors.totalRounds = 'Total rounds is required';
    } else if (parseInt(formData.totalRounds) < 1) {
      newErrors.totalRounds = 'Must have at least 1 round';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    console.log('Create event button clicked');

    if (!validate()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);
    console.log('Attempting to create event...');

    try {
      const startDateTime = `${formData.startDate}T10:00:00Z`;

      // Combine city and location for the backend
      const fullLocation = `${formData.location.trim()}, ${formData.city.trim()}`;

      const response = await tournamentAPI.create({
        name: formData.name.trim(),
        gameSystem: formData.gameSystem,
        format: 'Steamroller',
        status: formData.status,
        isRated: formData.isRated,
        description: formData.description.trim() || undefined,
        location: fullLocation,
        startDate: startDateTime,
        maxPlayers: parseInt(formData.maxPlayers),
        totalRounds: parseInt(formData.totalRounds),
        settings: {},
      });

      console.log('Event created successfully!', response);

      if (Platform.OS === 'web') {
        window.alert('Event created successfully!');
      } else {
        Alert.alert('Success', 'Event created successfully!');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Create event error:', error);
      console.error('Error details:', error.response?.data);

      const errorMessage =
        error.response?.data?.message || error.message || 'Could not create event. Please try again.';

      if (Platform.OS === 'web') {
        window.alert('Failed to create event: ' + errorMessage);
      } else {
        Alert.alert('Failed to create event', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}>
        <View style={[styles.formWrapper, isDesktop && styles.formWrapperDesktop]}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Text style={styles.title}>Create Event</Text>
            <Text style={styles.subtitle}>Set up a new tournament</Text>
          </LinearGradient>

          <View style={styles.form}>
          <Input
            label="Event Name *"
            placeholder="Winter Steamroller 2025"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            error={errors.name}
          />

          {/* Game System Selector */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Game System *</Text>
            <View style={styles.gameSystemButtons}>
              <TouchableOpacity
                style={[
                  styles.gameSystemButton,
                  formData.gameSystem === 'warmachine' && styles.gameSystemButtonActive,
                ]}
                onPress={() => updateField('gameSystem', 'warmachine')}
              >
                <Text
                  style={[
                    styles.gameSystemButtonText,
                    formData.gameSystem === 'warmachine' && styles.gameSystemButtonTextActive,
                  ]}
                >
                  Warmachine
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Selector */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Event Status *</Text>
            <View style={styles.gameSystemButtons}>
              <TouchableOpacity
                style={[
                  styles.gameSystemButton,
                  formData.status === 'draft' && styles.gameSystemButtonActive,
                ]}
                onPress={() => updateField('status', 'draft')}
              >
                <Text
                  style={[
                    styles.gameSystemButtonText,
                    formData.status === 'draft' && styles.gameSystemButtonTextActive,
                  ]}
                >
                  Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gameSystemButton,
                  formData.status === 'registration' && styles.gameSystemButtonActive,
                ]}
                onPress={() => updateField('status', 'registration')}
              >
                <Text
                  style={[
                    styles.gameSystemButtonText,
                    formData.status === 'registration' && styles.gameSystemButtonTextActive,
                  ]}
                >
                  Registration Open
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Draft: Event is hidden and not open for registration. Registration Open: Players can register immediately.
            </Text>
          </View>

          {/* Rated Event Selector */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Event Type *</Text>
            <View style={styles.gameSystemButtons}>
              <TouchableOpacity
                style={[
                  styles.gameSystemButton,
                  formData.isRated === true && styles.gameSystemButtonActive,
                ]}
                onPress={() => updateField('isRated', true)}
              >
                <Text
                  style={[
                    styles.gameSystemButtonText,
                    formData.isRated === true && styles.gameSystemButtonTextActive,
                  ]}
                >
                  Rated
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gameSystemButton,
                  formData.isRated === false && styles.gameSystemButtonActive,
                ]}
                onPress={() => updateField('isRated', false)}
              >
                <Text
                  style={[
                    styles.gameSystemButtonText,
                    formData.isRated === false && styles.gameSystemButtonTextActive,
                  ]}
                >
                  Unrated
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>
              Rated events affect player rankings. Unrated events are for practice and casual play.
            </Text>
          </View>

          <Input
            label="City *"
            placeholder="Seattle"
            value={formData.city}
            onChangeText={(text) => updateField('city', text)}
            error={errors.city}
          />

          <Input
            label="Venue *"
            placeholder="Local Game Store"
            value={formData.location}
            onChangeText={(text) => updateField('location', text)}
            error={errors.location}
          />

          <DatePicker
            label="Start Date *"
            value={formData.startDate}
            onChangeDate={(date) => updateField('startDate', date)}
            error={errors.startDate}
            placeholder="Select event date"
          />

          <Input
            label="Max Players *"
            placeholder="16"
            value={formData.maxPlayers}
            onChangeText={(text) => updateField('maxPlayers', text)}
            error={errors.maxPlayers}
            keyboardType="numeric"
          />

          <Input
            label="Total Rounds *"
            placeholder="4"
            value={formData.totalRounds}
            onChangeText={(text) => updateField('totalRounds', text)}
            error={errors.totalRounds}
            keyboardType="numeric"
          />

          <Input
            label="Description"
            placeholder="Optional event description"
            value={formData.description}
            onChangeText={(text) => updateField('description', text)}
            multiline
            numberOfLines={4}
          />

          <PrimaryButton
            title="Create Event"
            onPress={handleCreate}
            loading={loading}
            style={styles.createButton}
          />

          <OutlineButton title="Cancel" onPress={() => navigation.goBack()} />
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
  },
  scrollContentDesktop: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 1200,
    backgroundColor: colors.white,
    alignSelf: 'center',
  },
  formWrapperDesktop: {
    marginVertical: spacing.xl,
    borderRadius: spacing.radiusLg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
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
  form: {
    flex: 1,
    padding: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  gameSystemButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameSystemButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.gray100,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.gray100,
  },
  gameSystemButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  gameSystemButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.gray600,
  },
  gameSystemButtonTextActive: {
    color: colors.white,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
});

export default CreateTournamentScreen;
