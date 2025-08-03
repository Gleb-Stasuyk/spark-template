# Alias - Team Word Game
## Product Requirements Document

## Core Purpose & Success
- **Mission Statement**: Create an engaging team-based word explanation game that brings people together through fun, competitive gameplay.
- **Success Indicators**: Teams can easily set up games, enjoy smooth gameplay with clear scoring, and feel motivated to play multiple rounds.
- **Experience Qualities**: Fun, Fair, and Engaging.

## Project Classification & Approach
- **Complexity Level**: Light Application (multiple features with game state management)
- **Primary User Activity**: Interacting (real-time team gameplay with scoring and progression)

## Essential Features

### Core Gameplay
- **Team-based word explanation**: Players explain words to teammates without using forbidden methods
- **Real-time scoring**: +1 for correct guesses, -1 for skips/incorrect
- **Timed rounds**: Configurable round duration (30-120 seconds)
- **Fair victory conditions**: Winner determined when first team reaches target score AND all teams have played equal rounds

### Game Setup & Management
- **Theme selection**: Multiple word categories (Classic, Kids, Movies, Sports, Food, Custom)
- **Team configuration**: Support for 2-6 teams with custom names and colors
- **Game settings**: Adjustable winning score (20-100 points) and round time
- **Rules display**: Clear explanation of gameplay and victory conditions

### User Authentication & Collections
- **User accounts**: Registration and login system for personalized features
- **Integrated custom collections**: Collection management built into theme selection
- **Collection creation**: Create custom word banks directly from theme selection
- **Bulk import system**: Import words from text files or clipboard with smart processing
- **Template and export features**: Download template files and export collections for backup
- **Two-tier collection view**: "Mine" and "Shared with Me" tabs in Custom Collections
- **Collection sharing**: Share collections with specific users by username
- **Access control**: Adult-themed collections require authentication
- **Public/private collections**: Toggle collection visibility settings

### User Interface
- **Intuitive navigation**: Smooth flow between setup, gameplay, and results
- **Visual feedback**: Clear scoring display, team colors, and round progress
- **Round management**: Results screen showing correct/skipped words and updated scores

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Excitement, friendliness, and competitive spirit
- **Design Personality**: Modern, playful, and accessible
- **Visual Metaphors**: Team sports and collaboration
- **Simplicity Spectrum**: Clean interface that doesn't distract from gameplay

### Color Strategy
- **Color Scheme Type**: Triadic (three equally spaced colors for visual harmony)
- **Primary Color**: Electric Blue (oklch(0.65 0.25 240)) - trustworthy and energetic
- **Secondary Colors**: Light gray backgrounds for content hierarchy
- **Accent Color**: Purple (oklch(0.60 0.28 300)) - for highlights and special actions
- **Team Colors**: Electric Blue, Coral Red, Lime Green, Golden Yellow
- **Color Psychology**: Blue suggests reliability, red creates urgency, green indicates success
- **Foreground/Background Pairings**: 
  - Background (white) + Foreground (dark gray) = 15.8:1 contrast
  - Primary (blue) + White text = 4.8:1 contrast
  - Success (green) + Dark text = 5.2:1 contrast

### Typography System
- **Font Pairing Strategy**: Inter for all text (clean, modern, highly legible)
- **Typographic Hierarchy**: 
  - Game words: 3rem, bold, tight spacing
  - Team names: 1.5rem, bold
  - Timer: 1.75rem, bold, tabular numbers
  - Body text: 1rem, regular
- **Font Personality**: Professional yet approachable
- **Readability Focus**: High contrast, generous spacing, clear hierarchy

### Visual Hierarchy & Layout
- **Attention Direction**: Central focus on current word, secondary focus on timer and score
- **White Space Philosophy**: Generous padding creates calm, focused experience
- **Grid System**: Consistent spacing using Tailwind's spacing scale
- **Responsive Approach**: Mobile-first design with larger touch targets
- **Content Density**: Clean, uncluttered interface prioritizing essential information

### Animations
- **Purposeful Meaning**: Score changes animate to draw attention, celebrations enhance victory moments
- **Hierarchy of Movement**: Subtle transitions for state changes, energetic animations for celebrations
- **Contextual Appropriateness**: Smooth 200-300ms transitions, celebration animations for victories

### UI Elements & Component Selection
- **Component Usage**: shadcn/ui components for consistency and accessibility
- **Primary Actions**: Large, prominent buttons for game actions (Correct, Skip)
- **Secondary Actions**: Outline buttons for navigation (Back, Settings)
- **Component States**: Clear hover, active, and disabled states
- **Icon Selection**: Phosphor icons for clarity and consistency
- **Spacing System**: 0.75rem base radius, consistent padding/margins

### Accessibility & Readability
- **Contrast Goal**: WCAG AA compliance (4.5:1 minimum) achieved across all text combinations
- **Color Independence**: Information conveyed through multiple channels (color + text + icons)
- **Touch Targets**: Minimum 44px touch targets for mobile usability

## Game Rules & Victory Conditions

### Scoring System
- Correct word guess: +1 point
- Skipped or incorrectly explained word: -1 point
- Round score = Correct words - Skipped words

### Victory Conditions
The winner is determined by:
1. **First team to reach the target score** (configurable: 20-100 points)
2. **AND all teams must have played an equal number of rounds**

This ensures fair play - if a team reaches the winning score but other teams haven't had their turn in that round, the game continues until all teams have played the same number of rounds.

### Explanation Rules
**Not Allowed:**
- Using the actual word
- Direct translations or cognates
- Gestures or pointing
- "Sounds like" or "rhymes with" hints

**Allowed:**
- Describing function or purpose
- Physical descriptions
- Synonyms and related concepts
- Examples and context

## Implementation Considerations
- **State Management**: Persistent game state using useKV for cross-session continuity
- **Word Bank**: Curated word collections by theme with appropriate difficulty
- **Performance**: Fast word loading and smooth timer countdown
- **Cross-platform**: Responsive design for mobile and desktop play

## User Interface Flow

### Theme Selection (Updated)
- **Standard Collections**: Pre-built themed word banks (Classic, Movies, Sports, etc.)
- **Custom Collections Tab**: Requires user authentication
  - **Mine Sub-tab**: User's created collections with create/edit/share/delete actions
  - **Shared with Me Sub-tab**: Collections shared by other users (read-only)
- **Integrated Collection Management**: No separate management page - all actions within theme selection
- **Collection Cards**: Display collection name, description, word count, and sample words
- **Adult Content**: Locked behind authentication with clear indicators

### Collection Creation & Management
- **In-place Creation**: "Create Collection" card within the "Mine" tab
- **Edit Dialog**: Full collection editing with name, description, words, and privacy settings
- **Bulk Import Features**: 
  - **File Import**: Upload .txt files with words (one per line or comma-separated)
  - **Clipboard Import**: Import words directly from clipboard
  - **Template Download**: Download sample file format for easy preparation
  - **Export Function**: Export collections to .txt files for backup or sharing
  - **Smart Processing**: Handles mixed formats, ignores comment lines (#), deduplicates words
  - **Format Validation**: Supports up to 1000 words per collection, minimum 5 words required
- **Share Dialog**: Share with users by username, view current shares, remove access
- **Public/Private Toggle**: Control collection visibility directly from collection cards

## Collection Sharing System
### Sharing Features
- **Private collections**: Default visibility for new collections
- **Public collections**: Visible to all users when marked public
- **Targeted sharing**: Share with specific users by username
- **Access management**: Remove access from specific users
- **Collection attribution**: Original creator information preserved

### Privacy & Access Control
- **User authentication**: Required for creating and sharing collections
- **Adult content**: Restricted to authenticated users only
- **Ownership validation**: Only collection owners can edit, delete, or modify sharing
- **Shared collection usage**: Shared users can use but not modify collections

## Edge Cases & Problem Scenarios
- **Equal scores**: Highest score wins when target reached with equal rounds
- **Negative scores**: Teams can have negative scores from too many skips
- **Timer accuracy**: Precise countdown with clear visual feedback
- **Navigation**: Clear paths back to main menu from any screen

## Reflection
This approach balances competitive gameplay with fairness through the equal-rounds victory condition. The design emphasizes clarity and accessibility while maintaining the energy and excitement expected from a party game. The fair play mechanism ensures all teams get equal opportunities, making victories feel more earned and satisfying.