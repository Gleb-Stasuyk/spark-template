// Utility functions for KV storage with better error handling and validation

export interface CustomCollection {
  id: string
  name: string
  description: string
  words: string[]
  userId: string
  createdAt: string
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
    typeof collection.createdAt === 'string'
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