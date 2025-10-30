import React, { useState, useRef } from 'react';
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

const LoginScreen = ({ navigation }) => {
  const colors = useColors();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const passwordInputRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!login.trim()) {
      newErrors.login = 'Email or username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(login.trim(), password);

      // Store token and user data
      await storeToken(response.token);
      await storeUser(response.user);

      // Navigation will be handled by App.js checking auth state
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials. Please try again.'
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
        <View style={[styles.logoContainer, { backgroundColor: colors.bgSecondary }]}>
          <Text style={styles.logo}>🏆</Text>
          <Text style={[styles.appName, { color: colors.primary }]}>Pairings</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email or Username"
            placeholder="Enter your email or username"
            value={login}
            onChangeText={(text) => {
              setLogin(text);
              setErrors({ ...errors, login: null });
            }}
            error={errors.login}
            keyboardType="email-address"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            returnKeyType="next"
          />

          <Input
            ref={passwordInputRef}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: null });
            }}
            error={errors.password}
            secureTextEntry
            onSubmitEditing={handleLogin}
            returnKeyType="go"
          />

          <PrimaryButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
          >
            <Text style={[styles.registerText, { color: colors.textSecondary }]}>
              Don't have an account? <Text style={[styles.registerTextBold, { color: colors.primary }]}>Register</Text>
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
  logoContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  appName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  form: {
    flex: 1,
    padding: spacing.lg,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  registerLink: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  registerText: {
    fontSize: typography.sizes.sm,
  },
  registerTextBold: {
    fontWeight: typography.weights.semibold,
  },
});

export default LoginScreen;
