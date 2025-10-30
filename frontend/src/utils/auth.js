import AsyncStorage from '@react-native-async-storage/async-storage';

// Store auth token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

// Get auth token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove auth token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Store user data
export const storeUser = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error storing user:', error);
    return false;
  }
};

// Get user data
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = async () => {
  const token = await getToken();
  return token !== null;
};
