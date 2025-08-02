import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash, Edit, ArrowLeft, Collection } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CustomCollection {
  id: string
  name: string
  description: string
  words: string[]
  userId: string
  createdAt: string
}

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
  const [collections, setCollections] = useState<CustomCollection[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<CustomCollection | null>(null)
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [wordsText, setWordsText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load user's custom collections
  useEffect(() => {
    loadCollections()
  }, [user.id])

  const loadCollections = async () => {
    try {
      console.log('Loading collections for user:', user.id)
      const allCollections = await spark.kv.get<CustomCollection[]>('alias-custom-collections') || []
      console.log('All collections from storage:', allCollections)
      
      const userCollections = allCollections.filter(collection => collection.userId === user.id)
      console.log('User collections:', userCollections)
      
      setCollections(userCollections)
    } catch (error) {
      console.error('Error loading collections:', error)
      toast.error('Failed to load collections')
    }
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setWordsText('')
    setEditingCollection(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (collection: CustomCollection) => {
    setName(collection.name)
    setDescription(collection.description)
    setWordsText(collection.words.join('\n'))
    setEditingCollection(collection)
    setIsCreateDialogOpen(true)
  }

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    resetForm()
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

    const words = wordsText
      .split('\n')
      .map(word => word.trim())
      .filter(word => word.length > 0)

    if (words.length < 5) {
      toast.error('Please add at least 5 words')
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const words = wordsText
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length > 0)

      console.log('Saving collection:', { name, description, words, userId: user.id })

      const allCollections = await spark.kv.get<CustomCollection[]>('alias-custom-collections') || []
      console.log('Existing collections:', allCollections)

      if (editingCollection) {
        // Update existing collection
        const updatedCollection: CustomCollection = {
          ...editingCollection,
          name: name.trim(),
          description: description.trim(),
          words
        }

        const updatedCollections = allCollections.map(collection =>
          collection.id === editingCollection.id ? updatedCollection : collection
        )

        console.log('Updating collections:', updatedCollections)
        await spark.kv.set('alias-custom-collections', updatedCollections)
        toast.success('Collection updated successfully!')
      } else {
        // Create new collection
        const newCollection: CustomCollection = {
          id: Date.now().toString(),
          name: name.trim(),
          description: description.trim(),
          words,
          userId: user.id,
          createdAt: new Date().toISOString()
        }

        const updatedCollections = [...allCollections, newCollection]
        console.log('Creating new collection:', newCollection)
        console.log('All collections after adding:', updatedCollections)
        
        await spark.kv.set('alias-custom-collections', updatedCollections)
        toast.success('Collection created successfully!')
      }

      closeDialog()
      await loadCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
      toast.error(`Failed to save collection: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const allCollections = await spark.kv.get<CustomCollection[]>('alias-custom-collections') || []
      const updatedCollections = allCollections.filter(collection => collection.id !== collectionId)
      
      await spark.kv.set('alias-custom-collections', updatedCollections)
      loadCollections()
      toast.success('Collection deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete collection')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Game
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">My Custom Collections</h1>
            <p className="text-muted-foreground">Create and manage your personal word collections</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="flex items-center gap-2">
                <Plus size={16} />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
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
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Collection size={64} className="mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">No Collections Yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first custom word collection to get started
              </CardDescription>
              <Button onClick={openCreateDialog} className="flex items-center gap-2 mx-auto">
                <Plus size={16} />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                      {collection.description && (
                        <CardDescription className="mt-1">
                          {collection.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(collection)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(collection.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="text-xs">
                      {collection.words.length} words
                    </Badge>
                    
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}