import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Play, Question, User, Collection, ArrowLeft } from '@phosphor-icons/react'
import { Team, GameSettings, GameState, AuthUser } from '../App'
import { wordBanks } from '../data/wordBanks'
import { CustomCollection, getUserCollections } from '../utils/kvUtils'

interface ThemeSelectionProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  currentUser: AuthUser | null
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateGameState: (updates: Partial<GameState>) => void
  handleLogout?: () => void
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
  currentUser,
  updateGamePhase, 
  updateGameState,
  handleLogout
}: ThemeSelectionProps) {
  const [showCustomCollections, setShowCustomCollections] = useState(false)
  const [customCollections, setCustomCollections] = useState<CustomCollection[]>([])

  // Load custom collections when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadCustomCollections()
    }
  }, [currentUser])

  const loadCustomCollections = async () => {
    if (!currentUser) return
    
    try {
      const userCollections = await getUserCollections(currentUser.id)
      setCustomCollections(userCollections)
    } catch (error) {
      console.error('Failed to load custom collections:', error)
      setCustomCollections([])
    }
  }

  const handleThemeSelect = (themeId: string) => {
    updateGameState({ selectedTheme: themeId })
    if (showCustomCollections) {
      setShowCustomCollections(false)
    }
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

  const handleCustomCollections = () => {
    if (currentUser) {
      setShowCustomCollections(true)
    } else {
      updateGamePhase('auth')
    }
  }

  const handleManageCollections = () => {
    updateGamePhase('custom-collections')
  }

  // If showing custom collections, render the custom collections view
  if (showCustomCollections) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => setShowCustomCollections(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Themes
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Choose Custom Collection
              </h1>
              <p className="text-muted-foreground text-lg">
                Select from your custom word collections
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleManageCollections}
              className="flex items-center gap-2"
            >
              <Collection size={16} />
              Manage Collections
            </Button>
          </div>

          {customCollections.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Collection size={64} className="mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">No Custom Collections</h2>
                <p className="text-muted-foreground mb-4">
                  Create your first custom word collection to get started
                </p>
                <Button onClick={handleManageCollections} className="flex items-center gap-2 mx-auto">
                  <Collection size={16} />
                  Create Collection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {customCollections.map((collection) => (
                <Card
                  key={collection.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    gameState.selectedTheme === `custom-${collection.id}`
                      ? 'ring-2 ring-primary shadow-lg scale-105'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleThemeSelect(`custom-${collection.id}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">✨</div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-muted-foreground text-sm mb-3">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {collection.words.length} words
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Sample words:</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {collection.words.slice(0, 4).map((word, index) => (
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
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!gameState.selectedTheme || !gameState.selectedTheme.startsWith('custom-')}
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Choose a Game Theme
            </h1>
            <p className="text-muted-foreground text-lg">
              Select the category of words for your Alias game
            </p>
          </div>
          
          {/* User info and logout */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User size={16} />
                {currentUser.username}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
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
          
          {/* Custom Collections Card */}
          <Card
            className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 border-dashed ${
              gameState.selectedTheme?.startsWith('custom-')
                ? 'ring-2 ring-primary shadow-lg scale-105 border-primary'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={handleCustomCollections}
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Custom Collections
              </h3>
              <p className="text-muted-foreground text-sm mb-3">
                {currentUser 
                  ? `${customCollections.length} personal collections`
                  : 'Login to create custom words'
                }
              </p>
              <div className="text-xs text-muted-foreground">
                {currentUser ? (
                  <>
                    <p className="font-medium mb-1">Your collections:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {customCollections.length > 0 ? (
                        customCollections.slice(0, 3).map((collection, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted rounded-md text-xs truncate max-w-[80px]"
                            title={collection.name}
                          >
                            {collection.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs italic">
                          No collections yet
                        </span>
                      )}
                      {customCollections.length > 3 && (
                        <span className="px-2 py-1 bg-muted rounded-md text-xs">
                          +{customCollections.length - 3} more
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <User size={12} />
                    <span>Login required</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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

            {!currentUser && (
              <Button
                variant="outline"
                onClick={() => updateGamePhase('auth')}
                className="flex items-center gap-2"
              >
                <User size={20} />
                Login / Register
              </Button>
            )}
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