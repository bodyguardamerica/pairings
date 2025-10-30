import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button';
import { tournamentAPI } from '../../services/api';
import { getUser } from '../../utils/auth';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const EditRegistrationScreen = ({ route, navigation }) => {
  const { tournamentId } = route.params;
  const [formData, setFormData] = useState({
    listName: '',
    faction: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  useEffect(() => {
    loadCurrentRegistration();
  }, []);

  const loadCurrentRegistration = async () => {
    try {
      const user = await getUser();
      const playersData = await tournamentAPI.getPlayers(tournamentId);
      const registration = playersData.players.find(p => p.playerId === user.id);

      if (registration) {
        setPlayerId(registration.id);
        setFormData({
          listName: registration.listName || '',
          faction: registration.faction || '',
        });
      }
    } catch (error) {
      console.error('Error loading registration:', error);
      alert('Failed to load registration data');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.listName.trim()) {
      newErrors.listName = 'List name is required';
    }

    if (!formData.faction.trim()) {
      newErrors.faction = 'Faction is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      await tournamentAPI.updatePlayerList(tournamentId, playerId, {
        listName: formData.listName.trim(),
        faction: formData.faction.trim(),
      });

      const message = 'Registration updated successfully!';

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update registration';

      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Edit Registration</Text>
        <Text style={styles.subtitle}>Update your army list details</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Input
            label="List Name *"
            placeholder="e.g., Cygnar Storm Division"
            value={formData.listName}
            onChangeText={(text) => updateField('listName', text)}
            error={errors.listName}
          />

          <Input
            label="Faction *"
            placeholder="e.g., Cygnar"
            value={formData.faction}
            onChangeText={(text) => updateField('faction', text)}
            error={errors.faction}
          />

          <Text style={styles.helpText}>
            You can update your list name and faction at any time before the tournament starts.
          </Text>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={submitting ? 'Updating...' : 'Update Registration'}
              onPress={handleSubmit}
              disabled={submitting}
            />
            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              disabled={submitting}
            />
          </View>
        </View>
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
    backgroundColor: colors.bgSecondary,
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
  },
  form: {
    padding: spacing.lg,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
});

export default EditRegistrationScreen;
