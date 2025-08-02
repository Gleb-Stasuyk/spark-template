// Word banks for different game themes
import { getCustomCollections } from '../utils/kvUtils'

export interface WordBank {
  id: string
  name: string
  words: string[]
}

export const wordBanks: Record<string, WordBank> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    words: [
      'Adventure', 'Democracy', 'Lightning', 'Mathematics', 'Computer', 'Philosophy',
      'Revolution', 'Architecture', 'Psychology', 'Engineering', 'Literature', 'Chemistry',
      'Geography', 'History', 'Biology', 'Physics', 'Astronomy', 'Economy',
      'Government', 'Education', 'Communication', 'Transportation', 'Innovation', 'Discovery',
      'Technology', 'Science', 'Culture', 'Society', 'Environment', 'Universe',
      'Imagination', 'Creativity', 'Intelligence', 'Knowledge', 'Wisdom', 'Understanding',
      'Experience', 'Memory', 'Emotion', 'Friendship', 'Family', 'Community',
      'Tradition', 'Progress', 'Development', 'Achievement', 'Success', 'Challenge',
      'Opportunity', 'Solution', 'Problem', 'Question', 'Answer', 'Theory',
      'Practice', 'Method', 'System', 'Process', 'Structure', 'Function',
      'Purpose', 'Meaning', 'Value', 'Quality', 'Quantity', 'Relationship'
    ]
  },
  
  movies: {
    id: 'movies',
    name: 'Movies',
    words: [
      'Superhero', 'Thriller', 'Screenplay', 'Box Office', 'Director', 'Producer',
      'Actor', 'Actress', 'Camera', 'Script', 'Scene', 'Action',
      'Drama', 'Comedy', 'Horror', 'Romance', 'Adventure', 'Fantasy',
      'Science Fiction', 'Documentary', 'Animation', 'Musical', 'Western', 'Mystery',
      'Suspense', 'Blockbuster', 'Independent', 'Sequel', 'Prequel', 'Remake',
      'Adaptation', 'Original', 'Soundtrack', 'Special Effects', 'Cinematography', 'Editing',
      'Casting', 'Audition', 'Rehearsal', 'Performance', 'Character', 'Plot',
      'Dialogue', 'Monologue', 'Narrator', 'Protagonist', 'Antagonist', 'Supporting Role',
      'Lead Role', 'Cameo', 'Extra', 'Stunt', 'Double', 'Makeup',
      'Costume', 'Set Design', 'Location', 'Studio', 'Theater', 'Premiere',
      'Festival', 'Award', 'Critics', 'Reviews', 'Rating', 'Popcorn'
    ]
  },
  
  sports: {
    id: 'sports',
    name: 'Sports',
    words: [
      'Goalkeeper', 'Marathon', 'Championship', 'Stadium', 'Tournament', 'Olympics',
      'Coach', 'Referee', 'Athlete', 'Training', 'Exercise', 'Fitness',
      'Competition', 'Victory', 'Defeat', 'Score', 'Goal', 'Point',
      'Team', 'Player', 'Captain', 'Substitute', 'Bench', 'Field',
      'Court', 'Track', 'Pool', 'Gymnasium', 'Equipment', 'Uniform',
      'Jersey', 'Helmet', 'Ball', 'Racket', 'Bat', 'Club',
      'Stick', 'Glove', 'Shoes', 'Whistle', 'Timer', 'Stopwatch',
      'Medal', 'Trophy', 'Prize', 'Record', 'Personal Best', 'World Record',
      'Professional', 'Amateur', 'League', 'Division', 'Season', 'Playoffs',
      'Finals', 'Semifinal', 'Quarterfinal', 'Knockout', 'Round Robin', 'Home Team',
      'Away Team', 'Spectator', 'Fan', 'Crowd', 'Cheer', 'Celebration'
    ]
  },
  
  food: {
    id: 'food',
    name: 'Food',
    words: [
      'Spaghetti', 'Barbecue', 'Spicy', 'Restaurant', 'Chef', 'Kitchen',
      'Recipe', 'Ingredient', 'Cooking', 'Baking', 'Frying', 'Grilling',
      'Steaming', 'Boiling', 'Roasting', 'Seasoning', 'Flavor', 'Taste',
      'Sweet', 'Sour', 'Bitter', 'Salty', 'Umami', 'Fresh',
      'Organic', 'Healthy', 'Nutritious', 'Delicious', 'Appetizing', 'Mouth-watering',
      'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer',
      'Main Course', 'Side Dish', 'Salad', 'Soup', 'Sandwich', 'Pizza',
      'Burger', 'Pasta', 'Rice', 'Bread', 'Cheese', 'Meat',
      'Vegetarian', 'Vegan', 'Dairy', 'Protein', 'Carbohydrate', 'Vitamin',
      'Mineral', 'Calorie', 'Diet', 'Menu', 'Order', 'Waiter',
      'Waitress', 'Table', 'Reservation', 'Takeout', 'Delivery', 'Fast Food'
    ]
  },
  
  kids: {
    id: 'kids',
    name: 'Kids',
    words: [
      'Playground', 'Birthday', 'Cartoon', 'Ice Cream', 'Toy', 'Game',
      'Fun', 'Playing', 'Laughing', 'Happy', 'Excited', 'Curious',
      'Adventure', 'Imagination', 'Pretend', 'Make-believe', 'Story', 'Book',
      'Reading', 'Learning', 'School', 'Teacher', 'Friend', 'Classmate',
      'Homework', 'Crayon', 'Drawing', 'Coloring', 'Painting', 'Art',
      'Music', 'Singing', 'Dancing', 'Jumping', 'Running', 'Skipping',
      'Hopscotch', 'Hide and Seek', 'Tag', 'Ball', 'Doll', 'Teddy Bear',
      'Puzzle', 'Building Blocks', 'Swing', 'Slide', 'Seesaw', 'Sandbox',
      'Bicycle', 'Scooter', 'Skateboard', 'Jump Rope', 'Balloon', 'Bubble',
      'Magic', 'Fairy Tale', 'Princess', 'Knight', 'Dragon', 'Castle',
      'Superhero', 'Animal', 'Pet', 'Zoo', 'Park', 'Beach'
    ]
  }
}

// 18+ Adult-themed word banks (restricted to authorized users only)
export const adultWordBanks: Record<string, WordBank> = {
  mature: {
    id: 'mature',
    name: 'Mature Themes',
    words: [
      'Romance', 'Attraction', 'Passion', 'Desire', 'Intimacy', 'Relationship',
      'Dating', 'Flirting', 'Chemistry', 'Seduction', 'Temptation', 'Lust',
      'Affair', 'Commitment', 'Marriage', 'Divorce', 'Breakup', 'Heartbreak',
      'Jealousy', 'Infidelity', 'Trust', 'Betrayal', 'Secret', 'Scandal',
      'Forbidden', 'Taboo', 'Guilty Pleasure', 'Confession', 'Regret', 'Revenge',
      'Power', 'Control', 'Dominance', 'Submission', 'Rebellion', 'Authority',
      'Corruption', 'Manipulation', 'Blackmail', 'Conspiracy', 'Deception', 'Lies',
      'Truth', 'Reality', 'Fantasy', 'Dream', 'Nightmare', 'Fear',
      'Anxiety', 'Depression', 'Therapy', 'Addiction', 'Recovery', 'Healing',
      'Trauma', 'Pain', 'Suffering', 'Loss', 'Grief', 'Mourning',
      'Death', 'Violence', 'Aggression', 'Conflict', 'War', 'Peace'
    ]
  },
  
  party: {
    id: 'party',
    name: 'Party & Nightlife',
    words: [
      'Cocktail', 'Bartender', 'Nightclub', 'Bar', 'Pub', 'Lounge',
      'Happy Hour', 'Last Call', 'Hangover', 'Drunk', 'Tipsy', 'Sober',
      'Wine', 'Beer', 'Vodka', 'Whiskey', 'Rum', 'Tequila',
      'Champagne', 'Martini', 'Margarita', 'Mojito', 'Cosmopolitan', 'Shots',
      'Dancing', 'DJ', 'Music', 'Bass', 'Beat', 'Rhythm',
      'Clubbing', 'VIP', 'Bouncer', 'ID Check', 'Cover Charge', 'Line',
      'Party', 'Celebration', 'Toast', 'Cheers', 'Social', 'Networking',
      'Mingling', 'Small Talk', 'Pickup Line', 'Number', 'Date', 'Hook up',
      'One Night Stand', 'Casual', 'Serious', 'Complicated', 'Single', 'Taken',
      'Available', 'Interested', 'Attracted', 'Chemistry', 'Connection', 'Spark',
      'Conversation', 'Laughter', 'Fun', 'Wild', 'Crazy', 'Memorable',
      'Regrettable', 'Embarrassing', 'Confession', 'Secret', 'Gossip', 'Drama'
    ]
  },
  
  relationships: {
    id: 'relationships',
    name: 'Adult Relationships',
    words: [
      'Soulmate', 'Partner', 'Lover', 'Girlfriend', 'Boyfriend', 'Spouse',
      'Ex', 'Crush', 'Friend with Benefits', 'Situationship', 'Open Relationship', 'Polyamory',
      'Monogamy', 'Commitment', 'Engagement', 'Wedding', 'Honeymoon', 'Anniversary',
      'Valentine', 'Romance', 'Love Letter', 'Surprise', 'Gift', 'Flowers',
      'Dinner Date', 'Movie Night', 'Weekend Away', 'Vacation', 'Adventure', 'Memory',
      'First Kiss', 'First Time', 'Milestone', 'Moving In', 'Meeting Parents', 'Proposal',
      'Argument', 'Fight', 'Makeup', 'Forgiveness', 'Apology', 'Compromise',
      'Space', 'Break', 'Separation', 'Reconciliation', 'Closure', 'Moving On',
      'Rebound', 'Dating App', 'Profile', 'Match', 'Swipe', 'Chat',
      'Text', 'Call', 'Video Chat', 'Meeting', 'Chemistry', 'Compatibility',
      'Red Flag', 'Green Flag', 'Deal Breaker', 'Standards', 'Type', 'Preference',
      'Attraction', 'Physical', 'Emotional', 'Mental', 'Spiritual', 'Connection'
    ]
  }
}

// Function to get random words from a theme
export function getRandomWords(themeId: string, count: number = 100): string[] {
  const bank = wordBanks[themeId]
  if (!bank) return []
  
  const shuffled = [...bank.words].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Function to get a single random word
export async function getRandomWord(themeId: string, usedWords: string[] = []): Promise<string> {
  // Handle custom collections
  if (themeId.startsWith('custom-')) {
    const collectionId = themeId.replace('custom-', '')
    try {
      const allCollections = await getCustomCollections()
      const collection = allCollections.find(c => c.id === collectionId)
      
      if (collection && collection.words.length > 0) {
        const availableWords = collection.words.filter(word => !usedWords.includes(word))
        
        if (availableWords.length === 0) {
          // If all words used, reset the pool
          return collection.words[Math.floor(Math.random() * collection.words.length)]
        }
        return availableWords[Math.floor(Math.random() * availableWords.length)]
      } else {
        console.error('Collection not found or empty:', { collectionId, collection })
        return 'Error: Collection not found'
      }
    } catch (error) {
      console.error('Error loading custom collection:', error)
      return 'Error: Failed to load collection'
    }
  }
  
  // Handle adult themes (check adult word banks first)
  const adultBank = adultWordBanks[themeId]
  if (adultBank) {
    const availableWords = adultBank.words.filter(word => !usedWords.includes(word))
    if (availableWords.length === 0) {
      // If all words used, reset the pool
      return adultBank.words[Math.floor(Math.random() * adultBank.words.length)]
    }
    return availableWords[Math.floor(Math.random() * availableWords.length)]
  }
  
  // Handle predefined themes
  const bank = wordBanks[themeId]
  if (!bank) return 'Error: Theme not found'
  
  const availableWords = bank.words.filter(word => !usedWords.includes(word))
  if (availableWords.length === 0) {
    // If all words used, reset the pool
    return bank.words[Math.floor(Math.random() * bank.words.length)]
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)]
}

// Function to check if a theme is adult-only (18+)
export function isAdultTheme(themeId: string): boolean {
  return adultWordBanks.hasOwnProperty(themeId)
}

// Function to get all available themes for a user
export function getAvailableThemes(isAuthenticated: boolean): WordBank[] {
  const themes = Object.values(wordBanks)
  
  if (isAuthenticated) {
    // Add adult themes for authenticated users
    return [...themes, ...Object.values(adultWordBanks)]
  }
  
  return themes
}