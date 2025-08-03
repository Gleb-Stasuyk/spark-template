import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash, Edit, ArrowLeft, Collection, Share, Users, Globe, Lock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  CustomCollection, 
  getCustomCollections, 
  saveCustomCollections, 
  getUserCollections,
  getSharedCollections,
  shareCollection,
  unshareCollection,
  toggleCollectionPublic,
  getUserByUsername,
  getUsernameById
} from '../utils/kvUtils'

interface User {
  id: string
  username: string
  email: string
}

interface CustomCollectionsProps {
  user: User
  onBack: () => void
}

export default function CustomCollections({ user, onBack }: CustomCollectionsProps) {
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

  const resetForm = () => {
    setName('')
    setDescription('')
    setWordsText('')
    setIsPublic(false)
    setEditingCollection(null)
  }

  const loadCollections = async () => {
    try {
      const userCollections = await getUserCollections(user.id)
      const shared = await getSharedCollections(user.id)
      setMyCollections(userCollections)
      setSharedCollections(shared)
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    }
  }

  useEffect(() => {
    loadCollections()
  }, [user.id])

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
    if (!validateForm()) return

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
          userId: user.id,
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
    setIsPublic(collection.isPublic)
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

  const clearCorruptedData = async () => {
    if (!confirm('This will delete ALL custom collections. Are you sure?')) return
    
    try {
      await saveCustomCollections([])
      await loadCollections()
      toast.success('All data cleared successfully!')
    } catch (error) {
      console.error('Error clearing data:', error)
      toast.error('Failed to clear data')
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to Game
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Custom Collections</h1>
              <p className="text-muted-foreground">Create, manage and share your personal word collections</p>
            </div>
            <Button variant="destructive" size="sm" onClick={clearCorruptedData}>
              Clear All Data
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="my-collections" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-collections" className="flex items-center gap-2">
                <Collection size={16} />
                My Collections ({myCollections.length})
              </TabsTrigger>
              <TabsTrigger value="shared-collections" className="flex items-center gap-2">
                <Users size={16} />
                Shared with Me ({sharedCollections.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-collections" className="mt-6">
              {myCollections.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Collection size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <CardTitle className="mb-2">No Collections Yet</CardTitle>
                    <CardDescription className="mb-4">
                      Create your first custom word collection to get started
                    </CardDescription>
                    <Button onClick={openCreateDialog} className="flex items-center gap-2">
                      <Plus size={16} />
                      Create Collection
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Create Collection Card */}
                  <Card 
                    className="border-2 border-dashed border-primary/30 hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg bg-gradient-to-br from-primary/5 to-accent/5"
                    onClick={openCreateDialog}
                  >
                    <CardContent className="p-8 text-center">
                      <Plus size={48} className="mx-auto mb-3 text-primary" />
                      <CardTitle className="text-lg mb-2">Create Collection</CardTitle>
                      <CardDescription>
                        Add a new custom word collection
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  {/* Existing Collections */}
                  {myCollections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      isOwner={true}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                      onShare={openShareDialog}
                      onTogglePublic={handleTogglePublic}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="shared-collections" className="mt-6">
              {sharedCollections.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users size={64} className="mx-auto mb-4 text-muted-foreground" />
                    <CardTitle className="mb-2">No Shared Collections</CardTitle>
                    <CardDescription>
                      Collections shared with you by other users will appear here
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sharedCollections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      isOwner={false}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                      onShare={openShareDialog}
                      onTogglePublic={handleTogglePublic}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

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
    </>
  )
}

// Collection Card Component
interface CollectionCardProps {
  collection: CustomCollection
  isOwner: boolean
  onEdit: (collection: CustomCollection) => void
  onDelete: (collectionId: string) => void
  onShare: (collection: CustomCollection) => void
  onTogglePublic: (collection: CustomCollection) => void
}

function CollectionCard({ collection, isOwner, onEdit, onDelete, onShare, onTogglePublic }: CollectionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{collection.name}</CardTitle>
              {collection.isPublic && (
                <Badge variant="secondary" className="text-xs">
                  <Globe size={12} className="mr-1" />
                  Public
                </Badge>
              )}
              {!collection.isPublic && (
                <Badge variant="outline" className="text-xs">
                  <Lock size={12} className="mr-1" />
                  Private
                </Badge>
              )}
            </div>
            {collection.description && (
              <CardDescription className="line-clamp-2">
                {collection.description}
              </CardDescription>
            )}
          </div>
          
          {isOwner && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(collection)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onShare(collection)}>
                <Share size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onTogglePublic(collection)}
                title={collection.isPublic ? 'Make private' : 'Make public'}
              >
                {collection.isPublic ? <Lock size={16} /> : <Globe size={16} />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(collection.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash size={16} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Words:</span>
            <Badge variant="outline">{collection.words.length}</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Sample words:</p>
            <p className="line-clamp-2">
              {collection.words.slice(0, 3).join(', ')}
              {collection.words.length > 3 && '...'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Created {new Date(collection.createdAt).toLocaleDateString()}
          </p>
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