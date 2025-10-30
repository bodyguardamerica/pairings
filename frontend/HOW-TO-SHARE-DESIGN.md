# HOW TO SHARE DESIGN STYLE WITH OTHER CLAUDE INSTANCES

## Method 1: Upload the Design System File (Recommended)

1. **Download** `DESIGN-SYSTEM.md` from this chat
2. **Open a new Claude conversation** (Claude.ai or VS Code)
3. **Upload** the `DESIGN-SYSTEM.md` file
4. **Use this prompt:**

```
I'm building the [SCREEN/COMPONENT NAME] for the Pairings mobile app.

Please read the attached DESIGN-SYSTEM.md file and follow these design guidelines:
- Use the color palette (primary gradient #667eea to #764ba2)
- Follow the component patterns and spacing rules
- Match the mockup style
- Implement in [React Native/HTML/CSS]

[Add specific requirements here]
```

---

## Method 2: Copy-Paste Key Information

If you can't upload files, copy and paste this into your conversation:

```
I'm building a mobile app component. Please use this design system:

COLORS:
- Primary gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Primary: #667eea
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Gray-600: #666 (text)
- Gray-900: #333 (headings)

TYPOGRAPHY:
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Body: 15px
- Headings: 18-28px
- Labels: 13-14px

SPACING:
- Card padding: 20px
- Section margins: 15px
- Border radius: 12-15px for cards, 8-10px for buttons

BUTTONS:
- Primary: Gradient background, white text, 16px padding, 12px border-radius
- Secondary: Solid #667eea, white text, smaller padding

CARDS:
- White background, 15px border-radius, 20px padding
- Shadow: 0 2px 8px rgba(0,0,0,0.05)
- Hover: translateY(-2px)

Now build [COMPONENT NAME] following these styles.
```

---

## Method 3: Reference the GitHub Repository

If you've pushed the project to GitHub:

```
I'm working on the Pairings Project from https://github.com/bodyguardamerica/pairings

Please read:
1. docs/ARCHITECTURE.md - for system design
2. DESIGN-SYSTEM.md - for UI design guidelines
3. mockups/*.html - for visual reference

Now build [COMPONENT] matching this design style.
```

---

## Method 4: Share Specific HTML Mockup

Download one of the mockup HTML files and upload it:

```
I've attached an HTML mockup showing the design style I want.

Please extract the CSS styles and use them to build [NEW COMPONENT].

Key things to match:
- Color scheme (purple gradient)
- Typography
- Spacing and layout
- Component patterns

Implement in React Native.
```

---

## Example Prompts for Common Tasks

### Building a New Screen

```
I'm building the "Match Result Entry" screen for the Pairings mobile app.

Context: Read DESIGN-SYSTEM.md (attached)

Requirements:
- Header with tournament name and round info (like standings screen)
- Form to enter:
  - Winner selection (player 1 or player 2)
  - Victory condition (Assassination/Scenario/Deathclock)
  - Victory points for each player
  - Army points destroyed
- Submit button at bottom
- Use the same gradient header and card style from mockups

Please implement this in React Native following the design system.
```

---

### Creating a Reusable Component

```
Create a reusable StatusBadge component for the Pairings app.

Design System: See attached DESIGN-SYSTEM.md

Requirements:
- Props: status (live/upcoming/completed), label
- Styles from design system:
  - Live: green (#10b981)
  - Upcoming: orange (#f59e0b)  
  - Completed: gray (#e0e0e0)
- Small, rounded badge (12px font, 12px border-radius)
- 5px vertical, 12px horizontal padding

Implement in React Native.
```

---

### Styling an Existing Component

```
I have this React Native component that needs styling to match our design system.

Attached: DESIGN-SYSTEM.md

Current component:
[paste your code]

Please:
1. Apply colors from the design system
2. Use correct typography (fonts, sizes, weights)
3. Add proper spacing (padding, margins)
4. Add shadows where appropriate
5. Make it match the mockup style
```

---

### Building Backend API Endpoint

```
Build the POST /api/tournaments/:id/rounds endpoint.

Context:
- Read docs/ARCHITECTURE.md for system design
- Read docs/DATABASE.md for schema
- Read docs/API.md for API patterns

This endpoint should:
- Generate next round pairings
- Implement Swiss pairing algorithm
- Assign scenarios
- Handle byes

Follow the patterns established in the documentation.
```

---

## Tips for Best Results

### ✅ DO:
- Upload DESIGN-SYSTEM.md or reference mockups
- Be specific about what you're building
- Mention "Pairings Project" or "tournament organizer app"
- Ask to follow the design system explicitly
- Provide context about where the component fits

### ❌ DON'T:
- Expect Claude to remember previous conversations
- Assume styles without providing the design system
- Mix multiple design languages
- Skip uploading reference materials

---

## For VS Code Copilot / GitHub Copilot

Add this to your workspace or project README:

```markdown
## Design System

This project uses a purple gradient design system:
- Primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- See DESIGN-SYSTEM.md for complete guidelines
- Reference mockups/*.html for visual examples
```

Then in code comments:

```javascript
// TODO: Style this button using the primary gradient from DESIGN-SYSTEM.md
// Primary gradient: #667eea to #764ba2
// Border radius: 12px
// Padding: 16px
```

---

## Quick Copy-Paste Design Summary

```
DESIGN TOKENS:
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--primary: #667eea
--success: #10b981
--warning: #f59e0b
--text-dark: #333
--text-gray: #666
--bg-secondary: #f8f8f8
--radius-card: 15px
--radius-button: 12px
--padding-card: 20px
--shadow-card: 0 2px 8px rgba(0,0,0,0.05)

FONT SIZES:
--text-xs: 11px (nav labels)
--text-sm: 13px (secondary text)
--text-base: 15px (body)
--text-lg: 18px (card titles)
--text-xl: 24px (screen titles)

COMPONENTS:
- Cards: white bg, 15px radius, 20px padding, subtle shadow
- Buttons: gradient bg, white text, 12px radius, 16px padding
- Badges: 12px radius, 12px font, colored background
- Inputs: 15px padding, 2px border, 12px radius
```

---

## File Locations

After downloading from this chat:

```
Design System Guide: DESIGN-SYSTEM.md
HTML Mockups: mockups/01-login-screen.html through 05-profile.html
Architecture Docs: (from GitHub repo) docs/ARCHITECTURE.md
Database Schema: (from GitHub repo) docs/DATABASE.md
```

---

## Example: Complete Handoff Message

Copy this entire message to another Claude:

```
I'm working on the Pairings Project - a tournament organizer mobile app.

ATTACHED FILES:
- DESIGN-SYSTEM.md (complete design guidelines)
- 01-login-screen.html (mockup example)

TASK: Build the Tournament Creation screen

REQUIREMENTS:
1. Follow the design system exactly (purple gradient, spacing, typography)
2. Screen should have:
   - Gradient header with "Create Tournament" title
   - Form fields: Name, Date, Time, Max Players, Game System
   - Primary gradient button "Create Tournament"
   - Bottom navigation
3. Implement in React Native (Expo)
4. Match the mockup style from the HTML files

Please read the design system first, then build the component.
```

---

**That's it!** Choose the method that works best for your workflow.

Most reliable: **Method 1** (upload DESIGN-SYSTEM.md)  
Fastest: **Method 2** (copy-paste key tokens)  
Most complete: **Method 3** (reference full repo)
