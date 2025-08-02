export interface WordBank {
  [theme: string]: {
    easy: string[]
    medium: string[]
    hard: string[]
  }
}

export const WORD_BANKS: WordBank = {
  classic: {
    easy: [
      'Apple', 'Car', 'House', 'Book', 'Phone', 'Water', 'Sun', 'Moon', 'Tree', 'Cat',
      'Dog', 'Fish', 'Bird', 'Flower', 'Chair', 'Table', 'Door', 'Window', 'Fire', 'Ice',
      'Rain', 'Snow', 'Wind', 'Mountain', 'River', 'Ocean', 'Beach', 'Island', 'Bridge', 'Road'
    ],
    medium: [
      'Democracy', 'Philosophy', 'Psychology', 'Technology', 'Architecture', 'Literature', 'Mathematics',
      'Geography', 'History', 'Chemistry', 'Biology', 'Physics', 'Astronomy', 'Economy', 'Society',
      'Culture', 'Tradition', 'Innovation', 'Discovery', 'Adventure', 'Mystery', 'Fantasy', 'Reality',
      'Memory', 'Imagination', 'Creativity', 'Intelligence', 'Emotion', 'Personality', 'Character'
    ],
    hard: [
      'Metamorphosis', 'Serendipity', 'Ephemeral', 'Paradox', 'Irony', 'Metaphor', 'Allegory',
      'Juxtaposition', 'Dichotomy', 'Synchronicity', 'Existentialism', 'Nihilism', 'Pragmatism',
      'Determinism', 'Relativism', 'Empiricism', 'Rationalism', 'Skepticism', 'Stoicism', 'Hedonism',
      'Aesthetics', 'Epistemology', 'Ontology', 'Phenomenology', 'Hermeneutics', 'Dialectic', 'Synthesis',
      'Antithesis', 'Hypothesis', 'Paradigm'
    ]
  },
  movies: {
    easy: [
      'Hero', 'Villain', 'Princess', 'Dragon', 'Magic', 'Sword', 'Castle', 'Forest', 'Treasure', 'Adventure',
      'Comedy', 'Drama', 'Action', 'Romance', 'Horror', 'Thriller', 'Animation', 'Documentary', 'Musical', 'Western',
      'Director', 'Actor', 'Actress', 'Camera', 'Script', 'Scene', 'Theater', 'Cinema', 'Popcorn', 'Ticket'
    ],
    medium: [
      'Cinematography', 'Screenplay', 'Protagonist', 'Antagonist', 'Plot twist', 'Cliffhanger', 'Sequel', 'Prequel',
      'Trilogy', 'Franchise', 'Box office', 'Premiere', 'Red carpet', 'Oscar', 'Emmy', 'Golden Globe', 'Cannes',
      'Sundance', 'Independent film', 'Blockbuster', 'Cult classic', 'Genre', 'Subtext', 'Metaphor', 'Symbolism',
      'Montage', 'Flashback', 'Narrative', 'Character arc', 'MacGuffin'
    ],
    hard: [
      'Cinematographer', 'Mise-en-scène', 'Auteur theory', 'French New Wave', 'Film noir', 'Neorealism',
      'Expressionism', 'Surrealism', 'Dogme 95', 'Nouvelle Vague', 'Chiaroscuro', 'Deep focus', 'Long take',
      'Jump cut', 'Match cut', 'Dissolve', 'Fade', 'Wipe', 'Iris shot', 'Tracking shot', 'Dolly zoom',
      'Steadicam', 'Handheld', 'Crane shot', 'Aerial shot', 'Close-up', 'Medium shot', 'Wide shot', 'Establishing shot'
    ]
  },
  sports: {
    easy: [
      'Ball', 'Goal', 'Team', 'Player', 'Coach', 'Field', 'Stadium', 'Score', 'Win', 'Lose',
      'Run', 'Jump', 'Kick', 'Throw', 'Catch', 'Hit', 'Swim', 'Bike', 'Race', 'Competition',
      'Olympics', 'Medal', 'Gold', 'Silver', 'Bronze', 'Champion', 'Victory', 'Trophy', 'Award', 'Prize'
    ],
    medium: [
      'Tournament', 'Championship', 'Playoffs', 'Semifinals', 'Finals', 'League', 'Division', 'Conference',
      'Season', 'Draft', 'Trade', 'Contract', 'Salary cap', 'Free agent', 'Rookie', 'Veteran', 'All-star',
      'MVP', 'Hall of Fame', 'Record', 'Statistics', 'Analytics', 'Strategy', 'Tactics', 'Formation',
      'Substitution', 'Timeout', 'Penalty', 'Foul', 'Offside'
    ],
    hard: [
      'Periodization', 'Biomechanics', 'Kinesiology', 'Sports psychology', 'Performance analysis', 'Lactate threshold',
      'VO2 max', 'Anaerobic capacity', 'Plyometrics', 'Proprioception', 'Kinetic chain', 'Force-velocity curve',
      'Power-to-weight ratio', 'Periodization', 'Tapering', 'Peaking', 'Supercompensation', 'Overtraining',
      'Recovery protocols', 'Biomechanical efficiency', 'Motor learning', 'Skill acquisition', 'Transfer of training',
      'Specificity principle', 'Progressive overload', 'Adaptation', 'Homeostasis', 'Allostasis', 'Hormesis'
    ]
  },
  food: {
    easy: [
      'Pizza', 'Burger', 'Sandwich', 'Pasta', 'Rice', 'Bread', 'Cheese', 'Milk', 'Egg', 'Chicken',
      'Beef', 'Fish', 'Vegetable', 'Fruit', 'Apple', 'Banana', 'Orange', 'Tomato', 'Potato', 'Carrot',
      'Salt', 'Sugar', 'Oil', 'Butter', 'Flour', 'Bake', 'Fry', 'Boil', 'Grill', 'Steam'
    ],
    medium: [
      'Cuisine', 'Recipe', 'Ingredient', 'Seasoning', 'Marinade', 'Garnish', 'Appetizer', 'Entrée', 'Dessert',
      'Beverage', 'Fermentation', 'Preservation', 'Pasteurization', 'Caramelization', 'Emulsification',
      'Reduction', 'Infusion', 'Maceration', 'Blanching', 'Braising', 'Sautéing', 'Poaching', 'Roasting',
      'Smoking', 'Curing', 'Pickling', 'Molecular gastronomy', 'Farm-to-table', 'Organic', 'Sustainable'
    ],
    hard: [
      'Maillard reaction', 'Umami', 'Terroir', 'Mise en place', 'Brunoise', 'Julienne', 'Chiffonade', 'Bâtonnet',
      'Concassé', 'Bouquet garni', 'Sachet d\'épices', 'Roux', 'Liaison', 'Nappe', 'Confit', 'Sous vide',
      'Spherification', 'Gelification', 'Transglutaminase', 'Liquid nitrogen', 'Centrifuge', 'Rotary evaporator',
      'Immersion circulator', 'Pacojet', 'Anti-griddle', 'Ultrasonic bath', 'Gastronomy', 'Molecular cuisine',
      'Modernist cooking', 'Culinary anthropology'
    ]
  },
  kids: {
    easy: [
      'Toy', 'Game', 'Fun', 'Play', 'Friend', 'Family', 'Mom', 'Dad', 'Sister', 'Brother',
      'School', 'Teacher', 'Student', 'Crayon', 'Paper', 'Draw', 'Color', 'Paint', 'Sing', 'Dance',
      'Happy', 'Sad', 'Angry', 'Excited', 'Sleepy', 'Hungry', 'Thirsty', 'Hot', 'Cold', 'Big'
    ],
    medium: [
      'Playground', 'Bicycle', 'Skateboard', 'Scooter', 'Roller skates', 'Jump rope', 'Hopscotch', 'Hide and seek',
      'Tag', 'Red light green light', 'Musical chairs', 'Duck duck goose', 'Simon says', 'Freeze dance',
      'Treasure hunt', 'Puzzle', 'Board game', 'Card game', 'Video game', 'Building blocks', 'Lego', 'Dollhouse',
      'Action figure', 'Stuffed animal', 'Teddy bear', 'Puppet', 'Kite', 'Bubble', 'Balloon', 'Sticker'
    ],
    hard: [
      'Imagination', 'Creativity', 'Adventure', 'Discovery', 'Exploration', 'Wonder', 'Curiosity', 'Learning',
      'Growing up', 'Responsibility', 'Independence', 'Cooperation', 'Teamwork', 'Friendship', 'Kindness',
      'Sharing', 'Patience', 'Perseverance', 'Problem solving', 'Critical thinking', 'Communication', 'Expression',
      'Confidence', 'Self-esteem', 'Empathy', 'Compassion', 'Respect', 'Tolerance', 'Diversity', 'Inclusion'
    ]
  }
}

export const TEAM_COLORS = [
  'team-color-1', // Electric Blue
  'team-color-2', // Coral Red  
  'team-color-3', // Lime Green
  'team-color-4'  // Golden Yellow
]

export const getRandomWord = (theme: string): string => {
  const themeWords = WORD_BANKS[theme]
  if (!themeWords) return 'Error'
  
  // Mix all difficulties for variety
  const allWords = [...themeWords.easy, ...themeWords.medium, ...themeWords.hard]
  const randomIndex = Math.floor(Math.random() * allWords.length)
  return allWords[randomIndex]
}

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}