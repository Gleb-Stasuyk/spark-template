import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Play, Question } from '@phosphor-icons/react'
import { Team, GameSettings, GameState } from '../App'
import { wordBanks } from '../data/wordBanks'

interface ThemeSelectionProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateGameState: (updates: Partial<GameState>) => void
}

const themes = [
  { 
    id: 'classic', 
    name: 'Classic', 
    emoji: '🎯', 
    description: 'General knowledge words'
  },
  { 
    id: 'movies', 
    name: 'Movies', 
    emoji: '🎬', 
    description: 'Cinema and film terms'
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    emoji: '⚽', 
    description: 'Athletic and sports terms'
  },
  { 
    id: 'food', 
    name: 'Food', 
    emoji: '🍕', 
    description: 'Cooking and cuisine'
  },
  { 
    id: 'kids', 
    name: 'Kids', 
    emoji: '🧸', 
    description: 'Family-friendly words'
  },
  { 
    id: 'custom', 
    name: 'Custom', 
    emoji: '✨', 
    description: 'Your own word list'
  }
]

// Helper function to get sample words from word banks
const getSampleWords = (themeId: string): string[] => {
  const bank = wordBanks[themeId]
  if (!bank) return ['Sample', 'Words', 'Here', 'Soon']
  
  // Get first 4 words from the bank
  return bank.words.slice(0, 4)
}

export default function ThemeSelection({ 
  gameState, 
  updateGamePhase, 
  updateGameState 
}: ThemeSelectionProps) {
  const handleThemeSelect = (themeId: string) => {
    updateGameState({ selectedTheme: themeId })
  }

  const handleNext = () => {
    updateGamePhase('teams')
  }

  const handleSettings = () => {
    updateGamePhase('settings')
  }

  const handleRules = () => {
    updateGamePhase('rules')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Choose a Game Theme
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the category of words for your Alias game
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                gameState.selectedTheme === theme.id
                  ? 'ring-2 ring-primary shadow-lg scale-105'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{theme.emoji}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {theme.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {theme.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Sample words:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {getSampleWords(theme.id).map((word, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted rounded-md text-xs"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSettings}
              className="flex items-center gap-2"
            >
              <Settings size={20} />
              Settings
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRules}
              className="flex items-center gap-2"
            >
              <Question size={20} />
              Rules
            </Button>
          </div>

          <Button
            onClick={handleNext}
            disabled={!gameState.selectedTheme}
            className="flex items-center gap-2 px-8"
            size="lg"
          >
            <Play size={20} />
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}