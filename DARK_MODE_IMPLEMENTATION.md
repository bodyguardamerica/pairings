# Dark Mode Implementation Guide

## Overview
The Pairings app supports dark mode with a user-toggleable theme. The implementation uses React Context API for global theme state management with AsyncStorage for persistence.

## Current Status: Partial Implementation

### ✅ Fully Implemented
The following screens and components have full dark mode support:

**Screens:**
- `LoginScreen.js` - Authentication screen
- `RegisterScreen.js` - User registration
- `ProfileScreen.js` - User profile (includes dark mode toggle)
- `TournamentListScreen.js` - Main event listing
- `TournamentDetailsScreen.js` - Event details (info tab, organizer, description)
- Bottom Tab Navigation Bar

**Components:**
- `Input.js` - All text input fields
- `Button.js` - Primary, Secondary, Outline buttons
- `Card.js` - Card container component
- `Badge.js` - Status badges
- `TournamentCard.js` - Event card component

### ⚠️ Pending Implementation
The following screens still use static colors and need dark mode support:
- `CreateTournamentScreen.js`
- `EditTournamentScreen.js`
- `RegisterForTournamentScreen.js`
- `EditRegistrationScreen.js`
- `RoundDetailsScreen.js`
- `SubmitResultScreen.js`
- `AdminDashboardScreen.js`

---

## Architecture

### Core Files

**Theme Context:**
```
frontend/src/contexts/ThemeContext.js
```
- Provides `ThemeProvider` component
- Exports `useTheme()` hook for accessing theme state
- Manages AsyncStorage persistence

**Color Hook:**
```
frontend/src/hooks/useColors.js
```
- Exports `useColors()` hook
- Returns appropriate color palette based on current theme
- Contains both `lightColors` and `darkColors` palettes

**Color Constants:**
```
frontend/src/constants/colors.js
```
- Static color definitions (legacy, still used in some screens)
- Will be phased out as screens are migrated to theme system

---

## Current Color Palettes

### Light Mode (Default)
```javascript
{
  primary: '#667eea',
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f8f8',
  textPrimary: '#333333',
  textSecondary: '#666666',
  cardBg: '#ffffff',
  borderColor: '#e0e0e0',
  // ... additional colors
}
```

### Dark Mode (Color Hunt Palette)
```javascript
{
  primary: '#F05454',          // Coral red accent
  bgPrimary: '#222831',         // Dark charcoal background
  bgSecondary: '#30475E',       // Dark blue-gray surface
  textPrimary: '#DDDDDD',       // Light gray text
  textSecondary: '#b0b8c3',     // Muted gray
  cardBg: '#30475E',            // Card/input backgrounds
  borderColor: '#4a6382',       // Border lines
  // ... additional colors
}
```

**Note:** These colors are configurable and may change in the future. The color values are centralized in `useColors.js` for easy updates.

---

## How to Add Dark Mode to a Screen

### Step 1: Import the Hook
```javascript
import { useColors } from '../../hooks/useColors';
import colors from '../../constants/colors'; // Keep for StyleSheet definitions
```

### Step 2: Use the Hook in Component
```javascript
const MyScreen = ({ navigation }) => {
  const themeColors = useColors();
  // ... rest of component
```

**Important:** Use `themeColors` variable name to avoid conflict with static `colors` import.

### Step 3: Apply Dynamic Colors

**For main containers:**
```javascript
<View style={[styles.container, { backgroundColor: themeColors.bgSecondary }]}>
```

**For cards/sections:**
```javascript
<View style={[styles.card, {
  backgroundColor: themeColors.cardBg,
  borderColor: themeColors.borderColor
}]}>
```

**For text elements:**
```javascript
<Text style={[styles.label, { color: themeColors.textSecondary }]}>Label:</Text>
<Text style={[styles.value, { color: themeColors.textPrimary }]}>Value</Text>
```

**For buttons:**
```javascript
<TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]}>
  <Text style={[styles.buttonText, { color: themeColors.white }]}>Click</Text>
</TouchableOpacity>
```

**For inputs:**
```javascript
<TextInput
  style={[styles.input, {
    backgroundColor: themeColors.cardBg,
    color: themeColors.textPrimary,
    borderColor: themeColors.borderColor
  }]}
  placeholderTextColor={themeColors.textSecondary}
/>
```

### Step 4: Keep StyleSheet Static
Leave the StyleSheet.create() at the bottom unchanged:
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Don't include colors here
  },
  card: {
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    // Colors applied inline above
  },
});
```

---

## Color Mapping Guide

When converting a screen, use this mapping:

| Static Color (Old) | Theme Color (New) | Usage |
|-------------------|-------------------|--------|
| `colors.white` | `themeColors.bgPrimary` | Main backgrounds |
| `colors.gray50` | `themeColors.bgSecondary` | Elevated surfaces |
| `colors.white` (cards) | `themeColors.cardBg` | Cards, inputs |
| `colors.gray900` | `themeColors.textPrimary` | Main text |
| `colors.gray600` | `themeColors.textSecondary` | Labels, metadata |
| `colors.gray200` | `themeColors.borderColor` | Borders, dividers |
| `colors.primary` | `themeColors.primary` | Buttons, accents |
| `colors.gradientStart` | `themeColors.gradientStart` | Gradients |
| `colors.gradientEnd` | `themeColors.gradientEnd` | Gradients |

---

## User Toggle

Users can toggle dark mode from:
1. Navigate to **Profile** screen (top-right button on Events header)
2. Scroll to **Account** section
3. Use the **Dark Mode** switch

The preference is automatically saved to device storage and persists across sessions.

---

## App Initialization

The theme provider wraps the entire app in `App.js`:

```javascript
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </ThemeProvider>
  );
}
```

---

## Navigation Elements

**Stack Navigator Headers:**
Navigation headers in `AppNavigator.js` already use `useColors()` and automatically adapt to theme changes.

**Tab Bar:**
Bottom tab navigation in `AppNavigator.js` uses:
```javascript
tabBarStyle: {
  backgroundColor: colors.cardBg,
  borderTopColor: colors.borderColor,
}
```

---

## Testing Dark Mode

1. Start the app: `npm start` (in frontend directory)
2. Open browser at `http://localhost:8081`
3. Login to your account
4. Navigate to Profile → Toggle dark mode
5. Navigate through different screens to verify theming

---

## Common Pitfalls

### ❌ Don't Do This
```javascript
// Using hook outside component or in StyleSheet
const styles = StyleSheet.create({
  text: {
    color: useColors().textPrimary, // ERROR: Can't use hooks here
  },
});
```

### ✅ Do This Instead
```javascript
const MyComponent = () => {
  const colors = useColors();

  return (
    <Text style={[styles.text, { color: colors.textPrimary }]}>
      Hello
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // No color here
  },
});
```

### Handling Conflicts
If a screen has both static colors import and useColors():
```javascript
import { useColors } from '../../hooks/useColors';
import colors from '../../constants/colors'; // For StyleSheet

const MyScreen = () => {
  const themeColors = useColors(); // Use different variable name

  // Use themeColors for dynamic values
  // Use colors for static StyleSheet references
}
```

---

## Future Improvements

1. **Complete Coverage:** Update remaining screens to support dark mode
2. **Color Customization:** Allow users to choose different color palettes
3. **System Theme Sync:** Auto-detect OS dark mode preference
4. **Smooth Transitions:** Add animated transitions when toggling themes
5. **Component Library:** Create pre-themed components to simplify future screens

---

## Troubleshooting

**Issue:** Blank white screen after adding dark mode
- **Cause:** Using `useColors()` hook with static colors import creates conflict
- **Fix:** Rename hook variable to `themeColors` and keep static import as `colors`

**Issue:** Some elements not changing color
- **Cause:** StyleSheet.create() colors are static and don't respond to theme
- **Fix:** Apply colors inline using the `themeColors` variable

**Issue:** App crashes with "useTheme must be used within ThemeProvider"
- **Cause:** Component using `useColors()` is outside ThemeProvider
- **Fix:** Ensure App.js wraps navigator with `<ThemeProvider>`

---

## Maintenance Notes

- **Color Changes:** Update color values in `frontend/src/hooks/useColors.js`
- **New Screens:** Follow the "How to Add Dark Mode" guide above
- **Shared Components:** Always make new shared components theme-aware from the start
- **Migration Strategy:** Prioritize frequently-used screens first

Last Updated: 2025-10-30
Status: Partial Implementation - Core screens complete, secondary screens pending
