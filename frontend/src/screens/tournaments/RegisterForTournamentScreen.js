import React, { useState } from 'react';
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
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';
import { getResponsiveStyle } from '../../utils/responsive';

const RegisterForTournamentScreen = ({ route, navigation }) => {
  const { tournamentId } = route.params;
  const [formData, setFormData] = useState({
    listName: '',
    faction: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { isDesktop } = getResponsiveStyle();

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

    setLoading(true);

    try {
      await tournamentAPI.register(tournamentId, {
        listName: formData.listName.trim(),
        faction: formData.faction.trim(),
      });

      const message = 'Successfully registered for tournament!';

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register for tournament';

      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Register for Tournament</Text>
        <Text style={styles.subtitle}>Enter your army list details</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.formWrapper, isDesktop && styles.formWrapperDesktop]}>
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
              Enter your army list name and faction. You'll be able to update these details later if needed.
            </Text>

            <View style={styles.buttonContainer}>
              <PrimaryButton
                title={loading ? 'Registering...' : 'Register'}
                onPress={handleSubmit}
                disabled={loading}
              />
              <SecondaryButton
                title="Cancel"
                onPress={() => navigation.goBack()}
                disabled={loading}
              />
            </View>
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
  formWrapper: {
    width: '100%',
    maxWidth: 600,
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

export default RegisterForTournamentScreen;
