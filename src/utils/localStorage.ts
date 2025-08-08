// Local storage-based key-value store to replace spark.kv

class LocalKVStore {
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : undefined
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return undefined
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
      throw error
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error deleting localStorage key "${key}":`, error)
      throw error
    }
  }

  async keys(): Promise<string[]> {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.warn('Error getting localStorage keys:', error)
      return []
    }
  }
}

export const kv = new LocalKVStore()