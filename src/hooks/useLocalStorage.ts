import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Function to update the stored value
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      setStoredValue(prevValue => {
        const newValue = value instanceof Function ? value(prevValue) : value
        return newValue
      })
    } catch (error) {
      console.warn(`Error updating localStorage key "${key}":`, error)
    }
  }, [key])

  // Function to delete the stored value
  const deleteValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error deleting localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, deleteValue]
}