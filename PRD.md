# Alias - Team Word Explanation Game

A digital implementation of the classic team-based word explanation game where players describe words to their teammates without saying the actual word, racing against time to score points.

**Experience Qualities**:
1. **Energetic** - Fast-paced gameplay with vibrant animations and immediate feedback that keeps energy high
2. **Social** - Designed for group interaction with clear team identity and collaborative gameplay
3. **Intuitive** - Simple controls and clear visual hierarchy that anyone can understand instantly

**Complexity Level**: Light Application (multiple features with basic state)
- Multi-page navigation flow with game state management, team scoring, and timer functionality while maintaining simplicity for casual group play

## Essential Features

### Theme Selection
- **Functionality**: Choose word categories (Classic, Kids, Movies, Sports, Food, Custom)
- **Purpose**: Customize game content to match group preferences and knowledge
- **Trigger**: Game start or settings access
- **Progression**: Landing → Theme tiles display → Selection highlights → Settings/Next enabled → Navigate forward
- **Success criteria**: Theme persists through game, appropriate word bank loads

### Team Setup
- **Functionality**: Configure 2-4 teams with custom names
- **Purpose**: Establish team identity and player organization
- **Trigger**: After theme selection or from settings
- **Progression**: Team count selection → Name input fields appear → Validation → Start game enabled → Game begins
- **Success criteria**: Teams persist through entire game session with proper turn rotation

### Game Round Management
- **Functionality**: 60-second rounds with word display, scoring, and turn rotation
- **Purpose**: Core gameplay loop with clear feedback and progression
- **Trigger**: Game start or round continuation
- **Progression**: Team announcement → Timer starts → Word displays → Correct/Skip actions → Score tracking → Time up → Results
- **Success criteria**: Accurate scoring, smooth transitions, proper team rotation

### Live Scoring System
- **Functionality**: Real-time point tracking (+1 correct, -1 skip) with persistent totals
- **Purpose**: Maintain competitive tension and clear progress indication
- **Trigger**: Each correct/skip action during rounds
- **Progression**: Action button press → Immediate score update → Visual feedback → Running total updates → Victory check
- **Success criteria**: Accurate calculations, no score loss between rounds, clear victory detection

### Victory Detection
- **Functionality**: Automatic game end when team reaches target score with celebration
- **Purpose**: Clear conclusion with winner recognition and replay options
- **Trigger**: Team score reaches victory threshold
- **Progression**: Score check → Victory triggered → Animation plays → Final scoreboard → Replay options
- **Success criteria**: Correct winner identification, compelling celebration, easy restart

## Edge Case Handling

- **Empty team names**: Auto-generate default names (Team 1, Team 2, etc.)
- **Timer precision**: Handle browser tab switching and background states gracefully
- **Rapid button pressing**: Debounce score actions to prevent double-counting
- **Browser refresh**: Persist game state to continue interrupted games
- **Invalid configurations**: Fallback to default settings if corrupted data detected

## Design Direction

The design should feel energetic and playful like a TV game show, with bold colors and smooth animations that build excitement. The interface should be minimal and focused, emphasizing the current word and actions while maintaining team identity through consistent color coding.

## Color Selection

Triadic color scheme using three equally spaced colors to create vibrant team differentiation and high-energy atmosphere suitable for competitive group play.

- **Primary Color**: Electric Blue `oklch(0.65 0.25 240)` - Main actions and primary team color that conveys energy and focus
- **Secondary Colors**: 
  - Coral Red `oklch(0.65 0.20 30)` - Second team color and error states
  - Lime Green `oklch(0.70 0.25 120)` - Success states and third team color
  - Golden Yellow `oklch(0.75 0.15 80)` - Fourth team color and highlights
- **Accent Color**: Vibrant Purple `oklch(0.60 0.28 300)` - Call-to-action buttons and important notifications
- **Foreground/Background Pairings**: 
  - Background (White `oklch(1 0 0)`): Dark text `oklch(0.15 0 0)` - Ratio 14.8:1 ✓
  - Primary (Electric Blue): White text `oklch(1 0 0)` - Ratio 4.8:1 ✓
  - Secondary (Coral Red): White text `oklch(1 0 0)` - Ratio 4.9:1 ✓
  - Accent (Vibrant Purple): White text `oklch(1 0 0)` - Ratio 6.1:1 ✓
  - Card (Light Gray `oklch(0.98 0 0)`): Dark text `oklch(0.15 0 0)` - Ratio 13.9:1 ✓

## Font Selection

Typography should be bold and highly legible for fast reading during gameplay, with strong hierarchy to emphasize the current word and actions. Inter Bold for headings and Inter Regular for body text to maintain clarity at all sizes.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing for maximum impact
  - H2 (Team Names): Inter Bold/24px/normal spacing for clear team identification  
  - H3 (Current Word): Inter Bold/48px/wide letter spacing for instant readability
  - Body (Instructions): Inter Regular/16px/normal spacing for clear communication
  - Button Text: Inter SemiBold/14px/normal spacing for confident actions
  - Timer: Inter Bold/28px/monospace numbers for precise time display

## Animations

Animations should feel like a live game show with quick, energetic transitions that build excitement without delaying gameplay. Motion enhances the competitive atmosphere while providing clear feedback.

- **Purposeful Meaning**: Quick scale animations on correct answers, shake effects for skips, and smooth color transitions for team changes that reinforce game dynamics
- **Hierarchy of Movement**: 
  - Critical: Timer countdown, score changes, word transitions (immediate feedback)
  - Important: Page transitions, team announcements (maintain flow)
  - Delightful: Victory celebrations, button hover states (enhance experience)

## Component Selection

- **Components**: 
  - Cards for theme selection and team setup with hover animations
  - Buttons (Primary for main actions, Secondary for navigation) with press animations
  - Progress indicators for timer with color-coded urgency states
  - Badges for team identification with consistent color coding
  - Dialogs for settings and confirmation modals
  - Alerts for game announcements and results
- **Customizations**: 
  - Large word display component with text scaling
  - Circular timer component with color progression
  - Team scoreboard with animated score updates
  - Victory celebration with confetti animation effect
- **States**: 
  - Buttons have distinct pressed, hover, and disabled states with 150ms transitions
  - Timer changes color as time runs low (green → yellow → red)
  - Team cards highlight active team with border and shadow effects
  - Score displays animate on value changes with brief scale effect
- **Icon Selection**: 
  - CheckCircle for correct answers
  - XCircle for skips/incorrect
  - Play for start actions
  - Settings for configuration
  - Trophy for victory states
- **Spacing**: Consistent 4-unit (16px) spacing for major sections, 2-unit (8px) for related elements, 6-unit (24px) for page margins
- **Mobile**: 
  - Stack theme tiles vertically on mobile
  - Larger touch targets (48px minimum) for game action buttons
  - Responsive timer that scales appropriately
  - Simplified team selection with accordion-style expansion
  - Full-screen game interface optimizing for word visibility