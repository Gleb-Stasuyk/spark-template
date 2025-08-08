import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Gear, Question, SignOut, Lock, Plus } from '@phosphor-icons/react'

import { toast } from 'sonner'
import { Team, GameSettings, GameState, AuthUser } from '../App'
import { wordBanks, adultWordBanks, getAvailableThemes, isAdultTheme } from '../data/wordBanks'
import { 
  CustomCollection, 
  getUserCollections, 
  getSharedCollections, 
  getCustomCollections,
  saveCustomCollections,
  shareCollection,
  unshareCollection,
  toggleCollectionPublic,
  getUserByUsername,
  getUsernameById
} from '../utils/kvUtils'

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
  const [myCollections, setMyCollections] = useState<CustomCollection[]>([])
  const [sharedCollections, setSharedCollections] = useState<CustomCollection[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<CustomCollection | null>(null)
  const [sharingCollection, setSharingCollection] = useState<CustomCollection | null>(null)
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [wordsText, setWordsText] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Share state
  const [shareUsernames, setShareUsernames] = useState('')
  const [isSharing, setIsSharing] = useState(false)

  // Load custom collections when component mounts or user changes
  useEffect(() => {
    if (currentUser) {
      loadCollections()
    }
  }, [currentUser])

  const loadCollections = async () => {
    if (!currentUser) return
    
    try {
      const userCollections = await getUserCollections(currentUser.id)
      const shared = await getSharedCollections(currentUser.id)
      setMyCollections(userCollections)
      setSharedCollections(shared)
    } catch (error) {
      console.error('Failed to load custom collections:', error)
      setMyCollections([])
      setSharedCollections([])
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setWordsText('')
    setIsPublic(false)
    setEditingCollection(null)
  }

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Collection name is required')
      return false
    }

    if (!wordsText.trim()) {
      toast.error('At least one word is required')
      return false
    }

    const words = wordsText.split('\n').filter(word => word.trim().length > 0)
    if (words.length < 5) {
      toast.error('At least 5 words are required')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateForm() || !currentUser) return

    setIsLoading(true)
    try {
      const words = wordsText.split('\n').filter(word => word.trim().length > 0)
      
      if (editingCollection) {
        // Update existing collection
        const updatedCollection: CustomCollection = {
          ...editingCollection,
          name: name.trim(),
          description: description.trim(),
          words,
          isPublic
        }
        
        const allCollections = await getCustomCollections()
        const updatedCollections = allCollections.map(c => 
          c.id === editingCollection.id ? updatedCollection : c
        )
        
        await saveCustomCollections(updatedCollections)
        toast.success('Collection updated successfully!')
      } else {
        // Create new collection
        const newCollection: CustomCollection = {
          id: Date.now().toString(),
          name: name.trim(),
          description: description.trim(),
          words,
          isPublic,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          sharedWith: []
        }
        
        const allCollections = await getCustomCollections()
        await saveCustomCollections([...allCollections, newCollection])
        toast.success('Collection created successfully!')
      }
      
      await loadCollections()
      closeDialog()
    } catch (error) {
      console.error('Error saving collection:', error)
      toast.error('Failed to save collection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const allCollections = await getCustomCollections()
      const filteredCollections = allCollections.filter(c => c.id !== collectionId)
      await saveCustomCollections(filteredCollections)
      
      await loadCollections()
      toast.success('Collection deleted successfully!')
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  const handleTogglePublic = async (collection: CustomCollection) => {
    try {
      await toggleCollectionPublic(collection.id, !collection.isPublic)
      await loadCollections()
      toast.success(`Collection is now ${!collection.isPublic ? 'public' : 'private'}`)
    } catch (error) {
      console.error('Error toggling collection privacy:', error)
      toast.error('Failed to update collection privacy')
    }
  }

  const handleShare = async () => {
    if (!sharingCollection || !shareUsernames.trim()) {
      toast.error('Please enter at least one username')
      return
    }

    setIsSharing(true)
    try {
      const usernames = shareUsernames.split(',').map(u => u.trim()).filter(u => u.length > 0)
      
      for (const username of usernames) {
        const targetUser = await getUserByUsername(username)
        if (!targetUser) {
          toast.error(`User "${username}" not found`)
          continue
        }
        
        await shareCollection(sharingCollection.id, targetUser.id)
      }
      
      await loadCollections()
      toast.success('Collection shared successfully!')
      setIsShareDialogOpen(false)
      setShareUsernames('')
      setSharingCollection(null)
    } catch (error) {
      console.error('Error sharing collection:', error)
      toast.error('Failed to share collection')
    } finally {
      setIsSharing(false)
    }
  }

  const handleUnshare = async (collectionId: string, userId: string) => {
    try {
      await unshareCollection(collectionId, userId)
      await loadCollections()
      toast.success('Access removed successfully!')
    } catch (error) {
      console.error('Error unsharing collection:', error)
      toast.error('Failed to remove access')
    }
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (collection: CustomCollection) => {
    setEditingCollection(collection)
    setName(collection.name)
    setDescription(collection.description || '')
    setWordsText(collection.words.join('\n'))
    setIsPublic(collection.isPublic || false)
    setIsCreateDialogOpen(true)
  }

  const openShareDialog = (collection: CustomCollection) => {
    setSharingCollection(collection)
    setShareUsernames('')
    setIsShareDialogOpen(true)
  }

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    resetForm()
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
            >
              <Gear /> Settings
            </Button>
            
            <Button
              variant="outline"
              onClick={handleRules}
            >
              <Question /> Rules
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
                👤 Login / Register
              </Button>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  👤 {currentUser.username}
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
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
              {!currentUser && <span className="h-4 w-4 ml-2"><Lock /></span>}
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
                        <span className="h-5 w-5 text-muted-foreground"><Lock /></span>
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
                        <span className="h-3 w-3"><Lock /></span>
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
                  <span className="h-16 w-16 mx-auto mb-4 text-muted-foreground text-6xl"><Lock /></span>
                  <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                  <p className="text-muted-foreground mb-4">
                    Please log in to access custom word collections
                  </p>
                  <Button onClick={() => updateGamePhase('auth')} className="mx-auto">
                    👤 Login / Register
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="my-collections" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="my-collections">
                    📚 Mine ({myCollections.length})
                  </TabsTrigger>
                  <TabsTrigger value="shared-collections">
                    👥 Shared with Me ({sharedCollections.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="my-collections" className="space-y-6">
                  {myCollections.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <span className="h-16 w-16 mx-auto mb-4 text-muted-foreground text-6xl">📚</span>
                        <h2 className="text-2xl font-bold mb-2">No Collections Yet</h2>
                        <p className="text-muted-foreground mb-4">
                          Create your first custom word collection to get started
                        </p>
                        <Button onClick={openCreateDialog} className="mx-auto">
                          <Plus /> Create Collection
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Create Collection Card */}
                      <Card 
                        className="border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-accent/5"
                        onClick={openCreateDialog}
                      >
                        <CardContent className="p-8 text-center">
                          <span className="h-12 w-12 mx-auto mb-3 text-primary text-5xl block"><Plus /></span>
                          <h3 className="text-lg font-semibold mb-2">Create Collection</h3>
                          <p className="text-muted-foreground text-sm">
                            Add a new custom word collection
                          </p>
                        </CardContent>
                      </Card>
                      
                      {/* My Collections */}
                      {myCollections.map((collection) => (
                        <CollectionCard
                          key={collection.id}
                          collection={collection}
                          currentUser={currentUser}
                          isOwner={true}
                          onSelect={handleCustomThemeSelect}
                          onEdit={openEditDialog}
                          onDelete={handleDelete}
                          onShare={openShareDialog}
                          onTogglePublic={handleTogglePublic}
                          selected={gameState.selectedTheme === `custom-${collection.id}`}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shared-collections" className="space-y-6">
                  {sharedCollections.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <span className="h-16 w-16 mx-auto mb-4 text-muted-foreground text-6xl">👥</span>
                        <h2 className="text-2xl font-bold mb-2">No Shared Collections</h2>
                        <p className="text-muted-foreground">
                          Collections shared with you by other users will appear here
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sharedCollections.map((collection) => (
                        <CollectionCard
                          key={collection.id}
                          collection={collection}
                          currentUser={currentUser}
                          isOwner={false}
                          onSelect={handleCustomThemeSelect}
                          onEdit={openEditDialog}
                          onDelete={handleDelete}
                          onShare={openShareDialog}
                          onTogglePublic={handleTogglePublic}
                          selected={gameState.selectedTheme === `custom-${collection.id}`}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>
        </Tabs>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCollection ? 'Edit Collection' : 'Create New Collection'}
              </DialogTitle>
              <DialogDescription>
                {editingCollection 
                  ? 'Update your custom word collection'
                  : 'Create a custom word collection for your games'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collection-name">Collection Name</Label>
                <Input
                  id="collection-name"
                  placeholder="e.g., Movie Characters, Tech Terms"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection-description">Description (optional)</Label>
                <Input
                  id="collection-description"
                  placeholder="Brief description of this collection"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection-words">Words (one per line, minimum 5)</Label>
                <Textarea
                  id="collection-words"
                  placeholder="Enter words, one per line:&#10;Batman&#10;Superman&#10;Wonder Woman&#10;Flash&#10;Green Lantern"
                  value={wordsText}
                  onChange={(e) => setWordsText(e.target.value)}
                  rows={12}
                  disabled={isLoading}
                />
                {wordsText && (
                  <p className="text-sm text-muted-foreground">
                    {wordsText.split('\n').filter(word => word.trim().length > 0).length} words
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection-public">Make this collection public</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="collection-public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    disabled={isLoading}
                  />
                  <Label htmlFor="collection-public" className="text-sm text-muted-foreground">
                    {isPublic ? 'Anyone can see and use this collection' : 'Only you and people you share with can see this collection'}
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={closeDialog} disabled={isLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingCollection ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Collection</DialogTitle>
              <DialogDescription>
                Share "{sharingCollection?.name}" with other users
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="share-usernames">Usernames (comma-separated)</Label>
                <Input
                  id="share-usernames"
                  placeholder="e.g., john, mary, alex"
                  value={shareUsernames}
                  onChange={(e) => setShareUsernames(e.target.value)}
                  disabled={isSharing}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the usernames of people you want to share this collection with
                </p>
              </div>

              {sharingCollection && sharingCollection.sharedWith && sharingCollection.sharedWith.length > 0 && (
                <div className="space-y-2">
                  <Label>Currently shared with:</Label>
                  <div className="flex flex-wrap gap-2">
                    {sharingCollection.sharedWith.map((userId) => (
                      <SharedUserBadge
                        key={userId}
                        userId={userId}
                        onRemove={() => handleUnshare(sharingCollection.id, userId)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsShareDialogOpen(false)} disabled={isSharing}>
                  Cancel
                </Button>
                <Button onClick={handleShare} disabled={isSharing || !shareUsernames.trim()}>
                  {isSharing ? 'Sharing...' : 'Share'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Collection Card Component
interface CollectionCardProps {
  collection: CustomCollection
  currentUser: AuthUser
  isOwner: boolean
  selected: boolean
  onSelect: (themeId: string) => void
  onEdit: (collection: CustomCollection) => void
  onDelete: (collectionId: string) => void
  onShare: (collection: CustomCollection) => void
  onTogglePublic: (collection: CustomCollection) => void
}

function CollectionCard({ 
  collection, 
  currentUser, 
  isOwner, 
  selected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onShare, 
  onTogglePublic 
}: CollectionCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        selected ? 'ring-2 ring-primary shadow-lg scale-105' : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(`custom-${collection.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">✨</div>
          {isOwner && (
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(collection)
                }}
              >
                ✏️
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  onShare(collection)
                }}
              >
                🔗
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePublic(collection)
                }}
                title={collection.isPublic ? 'Make private' : 'Make public'}
              >
                {collection.isPublic ? '<Lock />' : '🌍'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(collection.id)
                }}
                className="text-destructive hover:text-destructive"
              >
                🗑️
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-center">
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
            {!isOwner && (
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
            {collection.isPublic && (
              <Badge variant="secondary" className="text-xs">
                🌍 Public
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
            {!isOwner && (
              <p className="mt-2 text-xs">
                Created by {collection.originalAuthor || 'Unknown'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Shared User Badge Component
interface SharedUserBadgeProps {
  userId: string
  onRemove: () => void
}

function SharedUserBadge({ userId, onRemove }: SharedUserBadgeProps) {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const loadUsername = async () => {
      const name = await getUsernameById(userId)
      setUsername(name || userId)
    }
    loadUsername()
  }, [userId])

  return (
    <Badge variant="secondary" className="flex items-center gap-2">
      {username || userId}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
        onClick={onRemove}
      >
        ×
      </Button>
    </Badge>
  )
}