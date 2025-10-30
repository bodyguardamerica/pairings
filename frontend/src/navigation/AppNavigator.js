import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, TouchableOpacity } from 'react-native';

// Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import TournamentListScreen from '../screens/tournaments/TournamentListScreen';
import TournamentDetailsScreen from '../screens/tournaments/TournamentDetailsScreen';
import CreateTournamentScreen from '../screens/tournaments/CreateTournamentScreen';
import RegisterForTournamentScreen from '../screens/tournaments/RegisterForTournamentScreen';
import EditRegistrationScreen from '../screens/tournaments/EditRegistrationScreen';
import RoundDetailsScreen from '../screens/tournaments/RoundDetailsScreen';
import SubmitResultScreen from '../screens/tournaments/SubmitResultScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

import { isLoggedIn, getUser } from '../utils/auth';
import { useColors } from '../hooks/useColors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack (for non-logged-in users)
const AuthStack = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
};

// Tournament Stack
const TournamentStack = ({ navigation }) => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
    <Stack.Screen
      name="TournamentList"
      component={TournamentListScreen}
      options={({ navigation: screenNavigation }) => ({
        title: 'Events',
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 15,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            onPress={() => screenNavigation.navigate('ProfileNav')}
          >
            <Text style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 14,
            }}>👤 Profile</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="TournamentDetails"
      component={TournamentDetailsScreen}
      options={{ title: 'Event Details' }}
    />
    <Stack.Screen
      name="CreateTournament"
      component={CreateTournamentScreen}
      options={{ title: 'Create Event' }}
    />
    <Stack.Screen
      name="RegisterForTournament"
      component={RegisterForTournamentScreen}
      options={{ title: 'Register for Event' }}
    />
    <Stack.Screen
      name="EditRegistration"
      component={EditRegistrationScreen}
      options={{ title: 'Edit Registration' }}
    />
    <Stack.Screen
      name="RoundDetails"
      component={RoundDetailsScreen}
      options={{ title: 'Round Details' }}
    />
    <Stack.Screen
      name="SubmitResult"
      component={SubmitResultScreen}
      options={{ title: 'Submit Result' }}
    />
    <Stack.Screen
      name="EditResult"
      component={SubmitResultScreen}
      options={{ title: 'Edit Result' }}
    />
    <Stack.Screen
      name="ProfileNav"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Stack.Navigator>
  );
};

// Main Tab Navigator (for logged-in users)
const MainTabs = () => {
  const colors = useColors();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.cardBg,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
          flexDirection: 'row',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Events"
        component={TournamentStack}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarButton: isAdmin ? undefined : () => null,
        }}
      />
    </Tab.Navigator>
  );
};

// Public Stack (for everyone, including non-logged-in users)
const PublicStack = () => {
  const colors = useColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      cardStyle: {
        flex: 1,
      },
    }}
  >
    <Stack.Screen
      name="TournamentList"
      component={TournamentListScreen}
      options={({ navigation }) => ({
        title: 'Events',
        headerRight: () => (
          <TouchableOpacity
            style={{
              marginRight: 15,
              paddingHorizontal: 15,
              paddingVertical: 8,
              backgroundColor: colors.white,
              borderRadius: 5,
            }}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={{
              color: colors.primary,
              fontWeight: 'bold',
              fontSize: 14,
            }}>Login</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen
      name="TournamentDetails"
      component={TournamentDetailsScreen}
      options={{ title: 'Event Details' }}
    />
    <Stack.Screen
      name="RoundDetails"
      component={RoundDetailsScreen}
      options={{ title: 'Round Details' }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        title: 'Login',
        headerBackTitle: 'Back'
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // Check auth status every second (simple polling)
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    const loggedIn = await isLoggedIn();
    setAuthenticated(loggedIn);
    setLoading(false);
  };

  if (loading) {
    return null; // Could show a splash screen here
  }

  return (
    <NavigationContainer>
      {authenticated ? <MainTabs /> : <PublicStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
