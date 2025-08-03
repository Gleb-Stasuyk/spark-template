import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Question, User, Collection, Lock } from '@phosphor-icons/react'
import { Team, GameSettings, GameState, AuthUser } from '../App'
import { wordBanks, adultWordBanks, getAvailableThemes, isAdultTheme } from '../data/wordBanks'
import { CustomCollection, getUserCollections, getAccessibleCollections } from '../utils/kvUtils'

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

const adultThemes = [
  {
    id: 'mature',
    name: 'Mature Themes',
    emoji: '🔞',
    description: 'Adult topics and situations'
  },
  {
    id: 'party',
    name: 'Party & Nightlife',
    emoji: '🍸',
    description: 'Nightlife and party culture'
  },
  {
    id: 'relationships',
    name: 'Adult Relationships',
    emoji: '💘',
    description: 'Dating and relationships'
  }
]

// Helper function to get sample words from word banks
const getSampleWords = (themeId: string): string[] => {
  const bank = wordBanks[themeId] || adultWordBanks[themeId]
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
      const accessibleCollections = await getAccessibleCollections(currentUser.id)
      setCustomCollections(accessibleCollections)
    } catch (error) {
      console.error('Failed to load custom collections:', error)
      setCustomCollections([])
    }
  }

  const handleThemeSelect = (themeId: string) => {
    updateGameState({ selectedTheme: themeId })
    
    // Check if selected theme is adult content and user is not authenticated
    if (isAdultTheme(themeId) && !currentUser) {
      updateGamePhase('auth')
      return
    }
    
    // Immediately navigate to team setup
    updateGamePhase('teams')
  }

  const handleSettings = () => {
    updateGamePhase('settings')
  }

  const handleRules = () => {
    updateGamePhase('rules')
  }

  const handleCustomThemeSelect = (themeId: string) => {
    updateGameState({ selectedTheme: themeId })
    // For custom collections, immediately navigate to team setup
    updateGamePhase('teams')
  }

  const handleManageCollections = () => {
    updateGamePhase('custom-collections')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation buttons */}
        <div className="flex items-center justify-between mb-8">
          {/* Settings and Rules buttons in upper-left corner */}
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

          {/* Auth buttons in upper-right corner */}
          <div className="flex items-center gap-3">
            {!currentUser ? (
              <Button
                variant="outline"
                onClick={() => updateGamePhase('auth')}
                className="flex items-center gap-2"
              >
                <User size={20} />
                Login / Register
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User size={16} />
                  {currentUser.username}
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Choose a Game Theme
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the category of words for your Alias game
          </p>
        </div>

        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="standard">Standard Collections</TabsTrigger>
            <TabsTrigger value="custom" disabled={!currentUser}>
              Custom Collections
              {!currentUser && <Lock size={16} className="ml-2" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-center mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {wordBanks[theme.id]?.words.length || 0} words
                      </Badge>
                    </div>
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

              {/* 18+ Adult Themes Section */}
              {adultThemes.map((theme) => (
                <Card
                  key={theme.id}
                  className={`relative transition-all duration-200 ${
                    currentUser 
                      ? `cursor-pointer hover:scale-105 hover:shadow-lg ${
                          gameState.selectedTheme === theme.id
                            ? 'ring-2 ring-primary shadow-lg scale-105'
                            : 'hover:shadow-md'
                        }`
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => currentUser ? handleThemeSelect(theme.id) : null}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-4xl">{theme.emoji}</span>
                      {!currentUser && (
                        <Lock size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {theme.name}
                      </h3>
                      <Badge variant="destructive" className="text-xs px-2 py-1">
                        18+
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {currentUser ? theme.description : 'Login required for adult content'}
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {adultWordBanks[theme.id]?.words.length || 0} words
                      </Badge>
                    </div>
                    {currentUser ? (
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
                    ) : (
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Lock size={12} />
                        <span>Restricted Content</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {!currentUser ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Lock size={64} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                  <p className="text-muted-foreground mb-4">
                    Please log in to access custom word collections
                  </p>
                  <Button onClick={() => updateGamePhase('auth')} className="flex items-center gap-2 mx-auto">
                    <User size={16} />
                    Login / Register
                  </Button>
                </CardContent>
              </Card>
            ) : customCollections.length === 0 ? (
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
              <>
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    onClick={handleManageCollections}
                    className="flex items-center gap-2"
                  >
                    <Collection size={16} />
                    Manage Collections
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customCollections.map((collection) => (
                    <Card
                      key={collection.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                        gameState.selectedTheme === `custom-${collection.id}`
                          ? 'ring-2 ring-primary shadow-lg scale-105'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleCustomThemeSelect(`custom-${collection.id}`)}
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
                          {collection.userId !== currentUser?.id && (
                            <Badge variant="outline" className="text-xs">
                              Shared
                            </Badge>
                          )}
                          {collection.isPublic && (
                            <Badge variant="secondary" className="text-xs">
                              Public
                            </Badge>
                          )}
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
                          {collection.userId !== currentUser?.id && (
                            <p className="mt-2 text-xs">
                              Created by {collection.originalAuthor || 'Unknown'}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}