# DESIGN SYSTEM - Pairings Project Mobile App

**Last Updated:** October 23, 2025  
**Purpose:** Guide for implementing consistent UI design across the mobile app

---

## Quick Start for Claude Instances

When building frontend components, use this prompt:

```
I'm building the [COMPONENT NAME] for the Pairings mobile app. 
Please follow the design system in DESIGN-SYSTEM.md:
- Use the color palette (primary gradient: #667eea to #764ba2)
- Follow the typography scale
- Use the component patterns
- Match the mockup style shown in the HTML examples
```

---

## Color Palette

### Primary Colors
```css
/* Main Gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Primary Purple */
--primary: #667eea;
--primary-dark: #764ba2;

/* Status Colors */
--success: #10b981;    /* Green - live/active */
--warning: #f59e0b;    /* Orange - upcoming */
--error: #ef4444;      /* Red - errors */
--info: #3b82f6;       /* Blue - info */
```

### Neutral Colors
```css
--white: #ffffff;
--gray-50: #f8f8f8;
--gray-100: #f0f0f0;
--gray-200: #e0e0e0;
--gray-400: #999999;
--gray-600: #666666;
--gray-900: #333333;
--black: #000000;
```

### Background Colors
```css
--bg-primary: #ffffff;      /* Main background */
--bg-secondary: #f8f8f8;    /* Secondary background */
--bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
```

### Font Sizes
```css
--text-xs: 11px;    /* Labels, captions */
--text-sm: 13px;    /* Secondary text */
--text-base: 15px;  /* Body text */
--text-lg: 18px;    /* Section headers */
--text-xl: 20px;    /* Screen titles */
--text-2xl: 24px;   /* Large titles */
--text-3xl: 28px;   /* Hero titles */
--text-4xl: 48px;   /* Logo/brand */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## Spacing Scale

Use consistent spacing throughout:

```css
--space-xs: 5px;
--space-sm: 10px;
--space-md: 15px;
--space-lg: 20px;
--space-xl: 30px;
--space-2xl: 40px;
```

### Common Patterns
- **Component padding:** 20px
- **Card padding:** 20px
- **Section margins:** 15px
- **Element gaps:** 10-15px

---

## Border Radius

```css
--radius-sm: 8px;     /* Small elements */
--radius-md: 12px;    /* Cards, inputs */
--radius-lg: 15px;    /* Large cards */
--radius-xl: 20px;    /* Badges, pills */
--radius-full: 50%;   /* Circles */
```

---

## Shadows

```css
/* Light shadow for cards */
box-shadow: 0 2px 8px rgba(0,0,0,0.05);

/* Medium shadow for elevated cards */
box-shadow: 0 4px 12px rgba(0,0,0,0.1);

/* Heavy shadow for modals */
box-shadow: 0 8px 24px rgba(0,0,0,0.15);

/* Primary color shadow */
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
```

---

## Component Patterns

### 1. Buttons

**Primary Button:**
```css
.btn-primary {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
}
```

**Secondary Button:**
```css
.btn-secondary {
    padding: 8px 16px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
}
```

---

### 2. Input Fields

```css
.input-field {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s;
}

.input-field:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

**With Label:**
```css
.input-label {
    display: block;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
}
```

---

### 3. Cards

**Basic Card:**
```css
.card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
```

**Tournament Card:**
```css
.tournament-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.tournament-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

---

### 4. Status Badges

```css
.status-badge {
    padding: 5px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.status-live {
    background: #10b981;
    color: white;
}

.status-upcoming {
    background: #f59e0b;
    color: white;
}

.status-completed {
    background: #e0e0e0;
    color: #666;
}
```

---

### 5. Navigation Tabs

```css
.tabs {
    display: flex;
    background: white;
    border-bottom: 2px solid #f0f0f0;
}

.tab {
    flex: 1;
    padding: 15px;
    text-align: center;
    color: #666;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
}

.tab.active {
    color: #667eea;
    border-bottom-color: #667eea;
}
```

---

### 6. Bottom Navigation

```css
.bottom-nav {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 70px;
    background: white;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    color: #999;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.2s;
}

.nav-item.active {
    color: #667eea;
}

.nav-label {
    font-size: 11px;
}
```

---

### 7. Floating Action Button (FAB)

```css
.fab {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 30px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    cursor: pointer;
    transition: transform 0.2s;
}

.fab:hover {
    transform: scale(1.1);
}
```

---

## Layout Patterns

### Mobile Phone Frame (375px width)
```css
.phone-frame {
    width: 375px;
    height: 812px;  /* iPhone X/11 height */
    background: white;
    border-radius: 40px;
    overflow: hidden;
}
```

### Status Bar
```css
.status-bar {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-size: 14px;
}
```

### Page Header
```css
.header {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.header-title {
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 15px;
}
```

### Scrollable Content Area
```css
.content {
    overflow-y: auto;
    height: calc(100% - [HEADER_HEIGHT] - [NAV_HEIGHT]);
    background: #f8f8f8;
}
```

---

## Icon Usage

Use emoji icons for quick prototyping:

```
🏆 - Tournaments
📊 - Statistics
👤 - Profile
⚔️ - Battle/Combat
📅 - Date
⏰ - Time
👥 - Players
🔍 - Search
➕ - Add
🔄 - Refresh
✓ - Success/Complete
🥇🥈🥉 - Rankings
📍 - Location
🎯 - Target/Scenario
⚡ - Speed/Fast
🔥 - Hot/Trending
```

---

## Animation & Transitions

### Hover Effects
```css
/* Cards */
transition: transform 0.2s, box-shadow 0.2s;
transform: translateY(-2px);

/* Buttons */
transition: transform 0.2s;
transform: translateY(-2px);

/* Colors */
transition: color 0.2s, background 0.2s;
```

### Focus States
```css
transition: all 0.3s;
box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
```

---

## React Native / Expo Implementation

When implementing in React Native (Expo), translate CSS to StyleSheet:

### Example Translation

**CSS:**
```css
.btn-primary {
    padding: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
}
```

**React Native:**
```javascript
import { LinearGradient } from 'expo-linear-gradient';

const styles = StyleSheet.create({
  btnPrimary: {
    padding: 16,
    borderRadius: 12,
  },
});

// In component:
<LinearGradient
  colors={['#667eea', '#764ba2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.btnPrimary}
>
  <Text>Button Text</Text>
</LinearGradient>
```

---

## Screen-Specific Patterns

### Login Screen
- Centered logo with gradient background
- Clean input fields with labels
- Full-width primary button
- Link to sign up at bottom

### Tournament List
- Search bar at top
- Horizontal filter tabs
- Scrollable card list
- FAB for creating tournaments
- Bottom navigation

### Standings Table
- Header with tournament info
- Tab navigation (Standings/Pairings/Results)
- Grid layout for data columns
- Color-coded rankings (gold/silver/bronze for top 3)

### Pairings View
- Table number badges
- VS separator between players
- Scenario information
- Highlight user's match
- Report result buttons

### Profile Screen
- Gradient header with avatar
- Stats grid (3 columns)
- Sectioned content (achievements, faction stats, recent tournaments)
- Achievement icons in grid

---

## Responsive Behavior

### Mobile First (375px)
- Base design for iPhone X/11
- Single column layouts
- Bottom navigation
- Full-width cards

### Tablet (768px+)
```css
@media (min-width: 768px) {
  .content {
    max-width: 768px;
    margin: 0 auto;
  }
  
  .grid-2col {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Desktop (1024px+)
```css
@media (min-width: 1024px) {
  .content {
    max-width: 1024px;
  }
  
  .grid-3col {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Accessibility

### Color Contrast
- Text on white: Use gray-900 (#333) or darker
- White text: Use on primary gradient or dark backgrounds
- Minimum contrast ratio: 4.5:1

### Touch Targets
- Minimum size: 44x44px
- Padding around clickable elements
- Clear hover/active states

### Font Sizes
- Minimum body text: 15px
- Labels can be 13px minimum
- Important info should be 16px+

---

## Code Examples

### Complete Button Component (React Native)

```javascript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PrimaryButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
```

### Complete Card Component (React Native)

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TournamentCard = ({ tournament, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{tournament.name}</Text>
            <Text style={styles.game}>{tournament.game}</Text>
          </View>
          <View style={[styles.badge, styles[`badge${tournament.status}`]]}>
            <Text style={styles.badgeText}>{tournament.status}</Text>
          </View>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.infoText}>📅 {tournament.date}</Text>
          <Text style={styles.infoText}>⏰ {tournament.time}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.players}>
            👥 {tournament.playerCount}/{tournament.maxPlayers} players
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  game: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeLive: {
    backgroundColor: '#10b981',
  },
  badgeUpcoming: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  players: {
    fontSize: 14,
    color: '#666',
  },
});

export default TournamentCard;
```

---

## File Structure for Components

```
frontend/src/
├── components/
│   ├── common/
│   │   ├── Button.js
│   │   ├── Input.js
│   │   ├── Card.js
│   │   ├── Badge.js
│   │   └── BottomNav.js
│   ├── tournament/
│   │   ├── TournamentCard.js
│   │   ├── StandingsTable.js
│   │   ├── PairingCard.js
│   │   └── TournamentHeader.js
│   └── profile/
│       ├── ProfileHeader.js
│       ├── StatCard.js
│       └── AchievementGrid.js
├── screens/
│   ├── LoginScreen.js
│   ├── TournamentListScreen.js
│   ├── StandingsScreen.js
│   ├── PairingsScreen.js
│   └── ProfileScreen.js
└── styles/
    ├── colors.js
    ├── typography.js
    └── spacing.js
```

---

## Quick Reference for AI Assistants

**When asked to build a component, refer to:**
1. Color palette section for colors
2. Component patterns section for structure
3. Code examples for implementation
4. Mockup HTML files for visual reference

**Key principles:**
- Mobile-first design
- Consistent spacing (20px padding, 15px margins)
- Purple gradient (#667eea to #764ba2) as primary
- Clean, modern aesthetic
- Touch-friendly (44px minimum)
- Clear visual hierarchy

---

**Document Version:** 1.0  
**Last Updated:** October 23, 2025  
**Reference Mockups:** See `/mockups/*.html` files
