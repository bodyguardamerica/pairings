import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/common/Input';
import { PrimaryButton, SecondaryButton } from '../../components/common/Button';
import { matchAPI } from '../../services/api';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const SubmitResultScreen = ({ route, navigation }) => {
  const { matchId, tournamentId, roundNumber } = route.params;
  const [match, setMatch] = useState(null);
  const [formData, setFormData] = useState({
    winnerId: '',
    player1ControlPoints: '',
    player2ControlPoints: '',
    player1ArmyPoints: '',
    player2ArmyPoints: '',
    scenario: '',
    resultType: 'scenario',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMatchData();
  }, []);

  const loadMatchData = async () => {
    try {
      const roundData = await require('../../services/api').tournamentAPI.getRound(tournamentId, roundNumber);
      const matchData = roundData.matches.find(m => m.id === matchId);
      setMatch(matchData);

      // If match is already completed, pre-fill form with existing data (editing mode)
      if (matchData && matchData.status === 'completed') {
        setFormData({
          winnerId: matchData.winnerId || '',
          player1ControlPoints: matchData.player1Score?.controlPoints?.toString() || '',
          player2ControlPoints: matchData.player2Score?.controlPoints?.toString() || '',
          player1ArmyPoints: matchData.player1Score?.armyPoints?.toString() || '',
          player2ArmyPoints: matchData.player2Score?.armyPoints?.toString() || '',
          scenario: matchData.scenario || '',
          resultType: matchData.resultData?.result_type || 'scenario',
        });
      }
    } catch (error) {
      console.error('Error loading match:', error);
      alert('Failed to load match data');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Warmachine scenarios
  const scenarios = [
    'Bunkers',
    'Invasion',
    'Mirage',
    'Recon II',
    'Spread the Net',
    'Take and Hold',
  ];

  const resultTypes = [
    { value: 'scenario', label: 'Scenario', icon: '🎯' },
    { value: 'assassination', label: 'Assassination', icon: '⚔️' },
    { value: 'timeout', label: 'Timeout', icon: '⏱️' },
    { value: 'concession', label: 'Concession', icon: '🏳️' },
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.winnerId) {
      newErrors.winnerId = 'Winner is required';
    }

    const p1CP = parseInt(formData.player1ControlPoints);
    const p2CP = parseInt(formData.player2ControlPoints);

    if (formData.player1ControlPoints === '') {
      newErrors.player1ControlPoints = 'Required';
    } else if (isNaN(p1CP) || p1CP < 0 || p1CP > 10) {
      newErrors.player1ControlPoints = 'Must be 0-10';
    }

    if (formData.player2ControlPoints === '') {
      newErrors.player2ControlPoints = 'Required';
    } else if (isNaN(p2CP) || p2CP < 0 || p2CP > 10) {
      newErrors.player2ControlPoints = 'Must be 0-10';
    }

    const p1AP = parseInt(formData.player1ArmyPoints);
    const p2AP = parseInt(formData.player2ArmyPoints);

    if (formData.player1ArmyPoints === '') {
      newErrors.player1ArmyPoints = 'Required';
    } else if (isNaN(p1AP) || p1AP < 0) {
      newErrors.player1ArmyPoints = 'Must be >= 0';
    }

    if (formData.player2ArmyPoints === '') {
      newErrors.player2ArmyPoints = 'Required';
    } else if (isNaN(p2AP) || p2AP < 0) {
      newErrors.player2ArmyPoints = 'Must be >= 0';
    }

    if (!formData.scenario) {
      newErrors.scenario = 'Scenario is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const isEditMode = match.status === 'completed';
      const resultData = {
        winner_id: formData.winnerId,
        player1_control_points: parseInt(formData.player1ControlPoints),
        player2_control_points: parseInt(formData.player2ControlPoints),
        player1_army_points: parseInt(formData.player1ArmyPoints),
        player2_army_points: parseInt(formData.player2ArmyPoints),
        scenario: formData.scenario,
        result_type: formData.resultType,
      };

      if (isEditMode) {
        await matchAPI.updateResult(matchId, resultData);
      } else {
        await matchAPI.submitResult(matchId, resultData);
      }

      const message = isEditMode
        ? 'Match result updated successfully!'
        : 'Match result submitted successfully!';

      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('Success', message);
      }

      navigation.goBack();
    } catch (error) {
      console.error('Submit result error:', error);
      const errorMessage = error.response?.data?.message ||
        (match.status === 'completed' ? 'Failed to update result' : 'Failed to submit result');

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
        <Text>Loading match data...</Text>
      </View>
    );
  }

  if (!match) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Match not found</Text>
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
        <Text style={styles.title}>
          {match.status === 'completed' ? 'Edit Match Result' : 'Submit Match Result'}
        </Text>
        <Text style={styles.subtitle}>Round {roundNumber}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Winner Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Winner *</Text>
            <Text style={styles.helpText}>Select which player won the match</Text>
            <View style={styles.winnerButtons}>
              <TouchableOpacity
                style={[
                  styles.winnerButton,
                  formData.winnerId === match.player1?.id && styles.winnerButtonActive,
                ]}
                onPress={() => updateField('winnerId', match.player1?.id)}
              >
                <Text style={[
                  styles.winnerButtonText,
                  formData.winnerId === match.player1?.id && styles.winnerButtonTextActive,
                ]}>
                  {match.player1?.username || 'Player 1'}
                </Text>
                <Text style={styles.winnerButtonFaction}>
                  {match.player1?.faction || ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.winnerButton,
                  formData.winnerId === match.player2?.id && styles.winnerButtonActive,
                ]}
                onPress={() => updateField('winnerId', match.player2?.id)}
              >
                <Text style={[
                  styles.winnerButtonText,
                  formData.winnerId === match.player2?.id && styles.winnerButtonTextActive,
                ]}>
                  {match.player2?.username || 'Player 2'}
                </Text>
                <Text style={styles.winnerButtonFaction}>
                  {match.player2?.faction || ''}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.winnerId && <Text style={styles.errorText}>{errors.winnerId}</Text>}
          </View>

          {/* Scenario Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Scenario *</Text>
            <View style={styles.chipGroup}>
              {scenarios.map((scenario) => (
                <TouchableOpacity
                  key={scenario}
                  style={[
                    styles.chip,
                    formData.scenario === scenario && styles.chipActive,
                  ]}
                  onPress={() => updateField('scenario', scenario)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.scenario === scenario && styles.chipTextActive,
                    ]}
                  >
                    {scenario}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.scenario && <Text style={styles.errorText}>{errors.scenario}</Text>}
          </View>

          {/* Result Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Result Type</Text>
            <View style={styles.chipGroup}>
              {resultTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.chip,
                    formData.resultType === type.value && styles.chipActive,
                  ]}
                  onPress={() => updateField('resultType', type.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.resultType === type.value && styles.chipTextActive,
                    ]}
                  >
                    {type.icon} {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Player 1 Scores */}
          <Text style={styles.sectionTitle}>{match.player1?.username || 'Player 1'} Scores</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Control Points *"
                placeholder="0-10"
                value={formData.player1ControlPoints}
                onChangeText={(text) => updateField('player1ControlPoints', text)}
                error={errors.player1ControlPoints}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Army Points *"
                placeholder="0"
                value={formData.player1ArmyPoints}
                onChangeText={(text) => updateField('player1ArmyPoints', text)}
                error={errors.player1ArmyPoints}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Player 2 Scores */}
          <Text style={styles.sectionTitle}>{match.player2?.username || 'Player 2'} Scores</Text>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Control Points *"
                placeholder="0-10"
                value={formData.player2ControlPoints}
                onChangeText={(text) => updateField('player2ControlPoints', text)}
                error={errors.player2ControlPoints}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Army Points *"
                placeholder="0"
                value={formData.player2ArmyPoints}
                onChangeText={(text) => updateField('player2ArmyPoints', text)}
                error={errors.player2ArmyPoints}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={
                submitting
                  ? (match.status === 'completed' ? 'Updating...' : 'Submitting...')
                  : (match.status === 'completed' ? 'Update Result' : 'Submit Result')
              }
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
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginBottom: spacing.sm,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.gray100,
    borderWidth: 2,
    borderColor: colors.gray100,
  },
  chipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.gray700,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.semibold,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  halfField: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  winnerButtons: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  winnerButton: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.gray100,
    borderWidth: 2,
    borderColor: colors.gray100,
  },
  winnerButtonActive: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  winnerButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.gray900,
  },
  winnerButtonTextActive: {
    color: colors.success,
  },
  winnerButtonFaction: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    marginTop: spacing.xs,
  },
});

export default SubmitResultScreen;
