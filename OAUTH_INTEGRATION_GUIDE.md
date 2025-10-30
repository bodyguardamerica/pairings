# OAuth Integration Guide - Google, Facebook, Apple Sign-In

**Last Updated:** October 25, 2025
**Current Auth:** JWT with email/password only
**Goal:** Add social login (Google, Facebook, Apple)

---

## Overview

Your current authentication uses JWT tokens with email/password. Adding OAuth providers (Google, Facebook, Apple) will:

✅ **Reduce friction** - Users don't need to create new passwords
✅ **Increase conversions** - 30-50% higher signup rates with social login
✅ **Better security** - OAuth providers handle password security
✅ **Faster registration** - Pre-filled name, email, profile picture

---

## Architecture Options

### **Option 1: Passport.js (Recommended)**

**Pros:**
- Most popular Node.js auth library (23k+ stars)
- Supports 500+ authentication strategies
- Easy to add multiple providers
- Well-documented
- Mature and stable

**Cons:**
- Adds dependency
- Slightly more complex setup

### **Option 2: Manual OAuth Implementation**

**Pros:**
- No extra dependencies
- Full control over flow
- Lighter weight

**Cons:**
- More code to maintain
- Must implement each provider manually
- Handle edge cases yourself

### **Option 3: Third-Party Auth Service (Auth0, Firebase Auth, Supabase Auth)**

**Pros:**
- Handles everything for you
- Built-in UI components
- Automatic security updates
- Email verification, password reset included

**Cons:**
- Monthly cost (Auth0: $25+/month, Firebase: Free tier then $$$)
- Vendor lock-in
- Less control

---

## Recommended Approach: Passport.js

We'll use Passport.js with your existing JWT system. Here's how:

---

## Implementation Plan

### **Phase 1: Backend Setup (2-3 days)**

#### Step 1: Install Dependencies

```bash
cd backend
npm install passport passport-google-oauth20 passport-facebook passport-apple
```

#### Step 2: Get OAuth Credentials

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Pairings App"
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Save Client ID and Client Secret

**Facebook:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app
3. Add Facebook Login product
4. Set redirect URI: `http://localhost:3000/api/auth/facebook/callback`
5. Save App ID and App Secret

**Apple:**
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create Service ID
3. Configure Sign in with Apple
4. Set return URL: `http://localhost:3000/api/auth/apple/callback`
5. Save Client ID and Secret

#### Step 3: Update Environment Variables

```env
# backend/.env

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Apple OAuth
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY_PATH=./apple-auth-key.p8
APPLE_CALLBACK_URL=http://localhost:3000/api/auth/apple/callback

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=http://localhost:19006
```

#### Step 4: Create Passport Configuration

**File:** `backend/src/config/passport.js`

```javascript
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const { pool } = require('./database');

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
        ['google', profile.id]
      );

      if (existingUser.rows.length > 0) {
        // User exists, return them
        return done(null, existingUser.rows[0]);
      }

      // Check if email already exists (link accounts)
      const emailUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (emailUser.rows.length > 0) {
        // Email exists, link OAuth to existing account
        const updated = await pool.query(
          `UPDATE users
           SET oauth_provider = $1, oauth_id = $2, updated_at = NOW()
           WHERE id = $3
           RETURNING *`,
          ['google', profile.id, emailUser.rows[0].id]
        );
        return done(null, updated.rows[0]);
      }

      // Create new user
      const newUser = await pool.query(
        `INSERT INTO users (email, username, first_name, last_name, oauth_provider, oauth_id, avatar_url, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'player')
         RETURNING *`,
        [
          profile.emails[0].value,
          profile.emails[0].value.split('@')[0], // Generate username from email
          profile.name.givenName,
          profile.name.familyName,
          'google',
          profile.id,
          profile.photos[0]?.value
        ]
      );

      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Similar logic to Google strategy
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
        ['facebook', profile.id]
      );

      if (existingUser.rows.length > 0) {
        return done(null, existingUser.rows[0]);
      }

      // Check email and create user (same as Google)
      // ... (similar code)

      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Apple Strategy
passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: process.env.APPLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple doesn't always provide email on subsequent logins
      const email = profile.email || idToken.email;

      const existingUser = await pool.query(
        'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
        ['apple', profile.id]
      );

      if (existingUser.rows.length > 0) {
        return done(null, existingUser.rows[0]);
      }

      // Create new user
      // ... (similar code)

      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, null);
    }
  }
));

module.exports = passport;
```

#### Step 5: Update Database Schema

**Create migration:** `backend/database/migrations/004_add_oauth_support.sql`

```sql
-- Add OAuth columns to users table
ALTER TABLE users
  ADD COLUMN oauth_provider VARCHAR(50), -- 'google', 'facebook', 'apple', etc.
  ADD COLUMN oauth_id VARCHAR(255), -- Provider's user ID
  ADD COLUMN avatar_url TEXT; -- Profile picture from OAuth

-- Make password optional (for OAuth users)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Create unique index on OAuth provider + ID
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id)
  WHERE oauth_provider IS NOT NULL;

-- Index for faster OAuth lookups
CREATE INDEX idx_users_oauth_provider ON users(oauth_provider);
```

Run migration:
```bash
npm run migrate
```

#### Step 6: Create OAuth Routes

**File:** `backend/src/api/oauthRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { generateToken } = require('../utils/jwt');

// Google OAuth
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user.id, req.user.email, req.user.role);

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Facebook OAuth
router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
    session: false
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`
  }),
  (req, res) => {
    const token = generateToken(req.user.id, req.user.email, req.user.role);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Apple OAuth
router.get('/apple',
  passport.authenticate('apple', {
    session: false
  })
);

router.get('/apple/callback',
  passport.authenticate('apple', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=apple_auth_failed`
  }),
  (req, res) => {
    const token = generateToken(req.user.id, req.user.email, req.user.role);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
```

#### Step 7: Update Server.js

```javascript
// backend/src/server.js

const passport = require('./config/passport');
const oauthRoutes = require('./api/oauthRoutes');

// Add passport middleware
app.use(passport.initialize());

// Mount OAuth routes
app.use('/api/auth', oauthRoutes);
```

---

### **Phase 2: Frontend Setup (2-3 days)**

#### Step 1: Install Dependencies

```bash
cd frontend
npm install expo-auth-session expo-web-browser
```

#### Step 2: Create OAuth Helper

**File:** `frontend/src/utils/oauth.js`

```javascript
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

// For web, we need to warm up the browser
WebBrowser.maybeCompleteAuthSession();

const API_URL = 'http://localhost:3000/api/auth';

export const signInWithGoogle = async () => {
  try {
    if (Platform.OS === 'web') {
      // Web: Open OAuth in popup/redirect
      window.location.href = `${API_URL}/google`;
    } else {
      // Mobile: Use in-app browser
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/google`,
        makeRedirectUri({ scheme: 'pairings' })
      );

      if (result.type === 'success') {
        // Extract token from URL
        const token = extractTokenFromUrl(result.url);
        return { success: true, token };
      }

      return { success: false };
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export const signInWithFacebook = async () => {
  try {
    if (Platform.OS === 'web') {
      window.location.href = `${API_URL}/facebook`;
    } else {
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/facebook`,
        makeRedirectUri({ scheme: 'pairings' })
      );

      if (result.type === 'success') {
        const token = extractTokenFromUrl(result.url);
        return { success: true, token };
      }

      return { success: false };
    }
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    return { success: false, error: error.message };
  }
};

export const signInWithApple = async () => {
  try {
    if (Platform.OS === 'web') {
      window.location.href = `${API_URL}/apple`;
    } else {
      const result = await WebBrowser.openAuthSessionAsync(
        `${API_URL}/apple`,
        makeRedirectUri({ scheme: 'pairings' })
      );

      if (result.type === 'success') {
        const token = extractTokenFromUrl(result.url);
        return { success: true, token };
      }

      return { success: false };
    }
  } catch (error) {
    console.error('Apple sign-in error:', error);
    return { success: false, error: error.message };
  }
};

const extractTokenFromUrl = (url) => {
  const match = url.match(/token=([^&]+)/);
  return match ? match[1] : null;
};
```

#### Step 3: Update LoginScreen

**File:** `frontend/src/screens/auth/LoginScreen.js`

```javascript
import { signInWithGoogle, signInWithFacebook, signInWithApple } from '../../utils/oauth';
import { storeToken, storeUser } from '../../utils/auth';

const LoginScreen = ({ navigation }) => {
  // ... existing code ...

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();

      if (result.success && result.token) {
        // Store token
        await storeToken(result.token);

        // Decode token to get user info
        const decoded = jwtDecode(result.token);
        await storeUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        });

        // Navigation handled by AppNavigator
      } else {
        Alert.alert('Error', 'Google sign-in failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithFacebook();

      if (result.success && result.token) {
        await storeToken(result.token);
        const decoded = jwtDecode(result.token);
        await storeUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        });
      } else {
        Alert.alert('Error', 'Facebook sign-in failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithApple();

      if (result.success && result.token) {
        await storeToken(result.token);
        const decoded = jwtDecode(result.token);
        await storeUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        });
      } else {
        Alert.alert('Error', 'Apple sign-in failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Existing email/password form */}

      {/* OAuth Buttons */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.oauthButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
        <Text style={styles.facebookIcon}>f</Text>
        <Text style={styles.oauthButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity style={styles.appleButton} onPress={handleAppleLogin}>
          <Text style={styles.appleIcon}></Text>
          <Text style={styles.oauthButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray200,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.gray600,
    fontSize: typography.sizes.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray200,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  oauthButtonText: {
    color: colors.gray900,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  facebookIcon: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
  appleIcon: {
    fontSize: 20,
    color: colors.white,
  },
});
```

#### Step 4: Create OAuth Callback Handler

**File:** `frontend/src/screens/auth/OAuthCallbackScreen.js`

```javascript
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { storeToken } from '../../utils/auth';
import { authAPI } from '../../services/api';

const OAuthCallbackScreen = ({ route, navigation }) => {
  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get token from URL parameters (web)
      const { token } = route.params || {};

      if (token) {
        // Store token
        await storeToken(token);

        // Fetch user profile
        const profile = await authAPI.getProfile();

        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(profile.user));

        // Navigate to main app (handled by AppNavigator)
      } else {
        // No token, redirect to login
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      navigation.replace('Login');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Completing sign in...</Text>
    </View>
  );
};

export default OAuthCallbackScreen;
```

#### Step 5: Update Navigation

```javascript
// frontend/src/navigation/AppNavigator.js

import OAuthCallbackScreen from '../screens/auth/OAuthCallbackScreen';

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen
      name="OAuthCallback"
      component={OAuthCallbackScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
```

#### Step 6: Update app.json for Deep Linking

```json
{
  "expo": {
    "name": "Pairings",
    "scheme": "pairings",
    "ios": {
      "bundleIdentifier": "com.yourcompany.pairings",
      "associatedDomains": ["applinks:yourapp.com"]
    },
    "android": {
      "package": "com.yourcompany.pairings",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "pairings"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

---

## Security Considerations

### 1. **HTTPS Required in Production**
```javascript
// Only allow OAuth in production with HTTPS
if (process.env.NODE_ENV === 'production' && !req.secure) {
  return res.status(403).json({ error: 'HTTPS required for OAuth' });
}
```

### 2. **State Parameter (CSRF Protection)**
```javascript
// Add state parameter to prevent CSRF attacks
const state = crypto.randomBytes(32).toString('hex');
// Store state in session/cache
// Verify state in callback
```

### 3. **Token Storage**
- Mobile: Use secure storage (expo-secure-store)
- Web: HttpOnly cookies (not localStorage)

### 4. **Email Verification**
```javascript
// Some OAuth providers don't verify emails
if (!user.emailVerified && provider === 'facebook') {
  // Send verification email
}
```

---

## Testing

### Local Testing:

1. **Set up ngrok** (for mobile testing):
```bash
ngrok http 3000
# Use ngrok URL in OAuth redirect URIs
```

2. **Test OAuth Flow:**
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Test each provider
```

### Test Scenarios:
- ✅ New user signs up with Google → Creates account
- ✅ Existing email signs in with Google → Links OAuth to account
- ✅ User with Google OAuth logs in again → Works
- ✅ User switches from email to Google → Links accounts
- ✅ OAuth fails → Shows error, allows retry

---

## Production Deployment

### Update OAuth Redirect URIs:

**Google:**
- `https://yourdomain.com/api/auth/google/callback`

**Facebook:**
- `https://yourdomain.com/api/auth/facebook/callback`

**Apple:**
- `https://yourdomain.com/api/auth/apple/callback`

### Environment Variables:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/auth/facebook/callback
APPLE_CALLBACK_URL=https://yourdomain.com/api/auth/apple/callback
```

---

## Alternative: Supabase Auth (Easier Option)

Since you're already using Supabase, you can use their built-in auth:

### Benefits:
- ✅ OAuth providers pre-configured
- ✅ Email verification built-in
- ✅ Password reset flows
- ✅ No backend code needed
- ✅ Free tier: 50,000 MAU

### Setup:

1. **Enable Auth Providers in Supabase:**
   - Go to Authentication → Providers
   - Enable Google, Facebook, Apple
   - Add redirect URLs

2. **Frontend (using @supabase/supabase-js):**
```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// Google sign-in
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'yourapp://auth/callback'
  }
});

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

---

## Recommendation

**For your project, I recommend:**

1. **Short-term (MVP):** Keep email/password, add later
2. **Medium-term:** Add Supabase Auth (easiest integration)
3. **Long-term:** If you need full control, use Passport.js

**Priority:**
- Focus on Phase 0 features first (public browsing, email alerts)
- Add OAuth in Phase 2 or 3

**Easiest path:**
1. Supabase Auth (2-3 hours setup)
2. Passport.js (2-3 days full implementation)
3. Manual OAuth (4-5 days)

---

## Complete Example: Supabase Auth Integration

### Backend Changes:
```javascript
// Minimal changes - just verify Supabase JWT
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Verify Supabase token
const verifySupabaseToken = async (token) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  return user;
};
```

### Frontend:
```javascript
import { supabase } from './supabaseClient';

// Sign in with Google
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

**That's it!** Supabase handles everything else.

---

## Conclusion

**Recommended Implementation Order:**

1. **Now:** Focus on Phase 0 (public browsing, email alerts) - 2-3 weeks
2. **Phase 1:** Core features (waiting lists, payments, etc.) - 5-6 weeks
3. **Phase 2:** OAuth integration via Supabase Auth - 2-3 hours
4. **Later:** Switch to Passport.js if you need more control

**Quick Win:** Supabase Auth is the fastest way to add OAuth with minimal code changes!

---

**Ready to implement? Let me know which approach you prefer!** 🚀
