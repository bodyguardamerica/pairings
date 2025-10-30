import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrimaryButton } from '../../components/common/Button';
import Input from '../../components/common/Input';
import { authAPI } from '../../services/api';
import { storeToken, storeUser } from '../../utils/auth';
import { useColors } from '../../hooks/useColors';
import typography from '../../constants/typography';
import spacing from '../../constants/spacing';

const RegisterScreen = ({ navigation }) => {
  const colors = useColors();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, _ and -';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    console.log('Register button clicked!');

    if (!validate()) {
      console.log('Validation failed');
      return;
    }

    setLoading(true);
    console.log('Attempting registration...');

    try {
      const response = await authAPI.register({
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
      });

      console.log('Registration successful!', response);

      // Store token and user data
      await storeToken(response.token);
      await storeUser(response.user);

      console.log('Token and user stored, should auto-navigate now');

      // Navigation will happen automatically via AppNavigator checking auth state
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', error.response?.data);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message || error.message || 'Could not create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={[styles.title, { color: colors.white }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.white }]}>Join the tournament community</Text>
        </LinearGradient>

        <View style={styles.form}>
          <Input
            label="Email *"
            placeholder="your@email.com"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            keyboardType="email-address"
          />

          <Input
            label="Username *"
            placeholder="Choose a username"
            value={formData.username}
            onChangeText={(text) => updateField('username', text)}
            error={errors.username}
          />

          <Input
            label="Password *"
            placeholder="At least 8 characters"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            error={errors.password}
            secureTextEntry
          />

          <Input
            label="Confirm Password *"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <Input
            label="First Name"
            placeholder="Optional"
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            autoCapitalize="words"
          />

          <Input
            label="Last Name"
            placeholder="Optional"
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            autoCapitalize="words"
          />

          <PrimaryButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.loginLink}
          >
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account? <Text style={[styles.loginTextBold, { color: colors.primary }]}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl2,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    opacity: 0.9,
  },
  form: {
    flex: 1,
    padding: spacing.lg,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.sizes.sm,
  },
  loginTextBold: {
    fontWeight: typography.weights.semibold,
  },
});

export default RegisterScreen;
