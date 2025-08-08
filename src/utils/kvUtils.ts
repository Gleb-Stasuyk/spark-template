// Utility functions for KV storage with better error handling and validation

export interface CustomCollection {
  id: string
  name: string
  description: string
  words: string[]
  userId: string
  createdAt: string
  isPublic?: boolean
  sharedWith?: string[] // Array of user IDs this collection is shared with
  originalAuthor?: string // Username of the original creator (for shared collections)
}

// Validate that a collection has all required fields and valid data
export function isValidCollection(collection: any): collection is CustomCollection {
  return (
    collection &&
    typeof collection.id === 'string' &&
    typeof collection.name === 'string' &&
    typeof collection.description === 'string' &&
    Array.isArray(collection.words) &&
    collection.words.every((word: any) => typeof word === 'string') &&
    typeof collection.userId === 'string' &&
    typeof collection.createdAt === 'string' &&
    (collection.isPublic === undefined || typeof collection.isPublic === 'boolean') &&
    (collection.sharedWith === undefined || Array.isArray(collection.sharedWith)) &&
    (collection.originalAuthor === undefined || typeof collection.originalAuthor === 'string')
  )
}

// Safely get and validate custom collections from KV storage
export async function getCustomCollections(): Promise<CustomCollection[]> {
  try {
    const data = await spark.kv.get<any>('alias-custom-collections')
    
    if (!data) {
      return []
    }
    
    if (!Array.isArray(data)) {
      console.warn('Invalid data structure in KV storage, expected array:', data)
      // Clear corrupted data
      await spark.kv.set('alias-custom-collections', [])
      return []
    }
    
    // Filter out invalid collections and return only valid ones
    const validCollections = data.filter(isValidCollection)
    
    // If we filtered out any invalid data, save the cleaned version
    if (validCollections.length !== data.length) {
      console.warn(`Filtered out ${data.length - validCollections.length} invalid collections`)
      await spark.kv.set('alias-custom-collections', validCollections)
    }
    
    return validCollections
  } catch (error) {
    console.error('Failed to get custom collections:', error)
    // If there's a parsing error, clear the storage and start fresh
    try {
      await spark.kv.set('alias-custom-collections', [])
    } catch (clearError) {
      console.error('Failed to clear corrupted data:', clearError)
    }
    return []
  }
}

// Safely save custom collections to KV storage
export async function saveCustomCollections(collections: CustomCollection[]): Promise<boolean> {
  try {
    // Validate all collections before saving
    const validCollections = collections.filter(isValidCollection)
    
    if (validCollections.length !== collections.length) {
      console.warn(`Attempting to save invalid collections, filtered out ${collections.length - validCollections.length}`)
    }
    
    await spark.kv.set('alias-custom-collections', validCollections)
    return true
  } catch (error) {
    console.error('Failed to save custom collections:', error)
    return false
  }
}

// Get collections for a specific user
export async function getUserCollections(userId: string): Promise<CustomCollection[]> {
  const allCollections = await getCustomCollections()
  return allCollections.filter(collection => collection.userId === userId)
}

// Get collections shared with a specific user
export async function getSharedCollections(userId: string): Promise<CustomCollection[]> {
  const allCollections = await getCustomCollections()
  return allCollections.filter(collection => 
    collection.sharedWith?.includes(userId) ||
    (collection.isPublic && collection.userId !== userId)
  )
}

// Get all accessible collections for a user (owned + shared + public)
export async function getAccessibleCollections(userId: string): Promise<CustomCollection[]> {
  const allCollections = await getCustomCollections()
  return allCollections.filter(collection =>
    collection.userId === userId || 
    collection.sharedWith?.includes(userId) ||
    collection.isPublic
  )
}

// Simple user storage functions for username lookups
export interface UserInfo {
  id: string
  username: string
  email: string
}

export async function saveUserInfo(user: UserInfo): Promise<boolean> {
  try {
    const existingUsers = await spark.kv.get<UserInfo[]>('alias-users') || []
    const updatedUsers = existingUsers.filter(u => u.id !== user.id)
    updatedUsers.push(user)
    await spark.kv.set('alias-users', updatedUsers)
    return true
  } catch (error) {
    console.error('Failed to save user info:', error)
    return false
  }
}

export async function getUserByUsername(username: string): Promise<string | null> {
  try {
    const users = await spark.kv.get<UserInfo[]>('alias-users') || []
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase())
    return user ? user.id : null
  } catch (error) {
    console.error('Failed to get user by username:', error)
    return null
  }
}

export async function getUsernameById(userId: string): Promise<string | null> {
  try {
    const users = await spark.kv.get<UserInfo[]>('alias-users') || []
    const user = users.find(u => u.id === userId)
    return user ? user.username : null
  } catch (error) {
    console.error('Failed to get username by id:', error)
    return null
  }
}

// Share a collection with specific users
export async function shareCollection(collectionId: string, targetUserIds: string[]): Promise<boolean> {
  try {
    const allCollections = await getCustomCollections()
    const collectionIndex = allCollections.findIndex(c => c.id === collectionId)
    
    if (collectionIndex === -1) {
      return false
    }
    
    const collection = allCollections[collectionIndex]
    const currentSharedWith = collection.sharedWith || []
    const newSharedWith = [...new Set([...currentSharedWith, ...targetUserIds])]
    
    allCollections[collectionIndex] = {
      ...collection,
      sharedWith: newSharedWith
    }
    
    return await saveCustomCollections(allCollections)
  } catch (error) {
    console.error('Failed to share collection:', error)
    return false
  }
}

// Unshare a collection from specific users
export async function unshareCollection(collectionId: string, targetUserIds: string[]): Promise<boolean> {
  try {
    const allCollections = await getCustomCollections()
    const collectionIndex = allCollections.findIndex(c => c.id === collectionId)
    
    if (collectionIndex === -1) {
      return false
    }
    
    const collection = allCollections[collectionIndex]
    const currentSharedWith = collection.sharedWith || []
    const newSharedWith = currentSharedWith.filter(userId => !targetUserIds.includes(userId))
    
    allCollections[collectionIndex] = {
      ...collection,
      sharedWith: newSharedWith.length > 0 ? newSharedWith : undefined
    }
    
    return await saveCustomCollections(allCollections)
  } catch (error) {
    console.error('Failed to unshare collection:', error)
    return false
  }
}

// Toggle public status of a collection
export async function toggleCollectionPublic(collectionId: string, isPublic: boolean): Promise<boolean> {
  try {
    const allCollections = await getCustomCollections()
    const collectionIndex = allCollections.findIndex(c => c.id === collectionId)
    
    if (collectionIndex === -1) {
      return false
    }
    
    allCollections[collectionIndex] = {
      ...allCollections[collectionIndex],
      isPublic
    }
    
    return await saveCustomCollections(allCollections)
  } catch (error) {
    console.error('Failed to toggle collection public status:', error)
    return false
  }
}

// Get users who have access to a collection (for admin purposes)
export function getCollectionAccessUsers(collection: CustomCollection): string[] {
  const users = [collection.userId] // Owner always has access
  if (collection.sharedWith) {
    users.push(...collection.sharedWith)
  }
  return [...new Set(users)]
}