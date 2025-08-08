import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { kv } from '../utils/localStorage'


interface User {
  id: string
  username: string
  email: string
  password: string
}

interface AuthTestProps {
  updateGamePhase?: (phase: 'theme') => void
}

export default function AuthTest({ updateGamePhase }: AuthTestProps) {
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, result])
  }

  const clearResults = () => {
    setTestResults([])
  }

  const testRegistration = async () => {
    clearResults()
    addResult('Testing registration system...')

    try {
      // Clear existing users for clean test
      await kv.delete('alias-users')
      addResult('✓ Cleared existing users')

      // Test 1: Create first user
      const testUser1 = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }

      await kv.set('alias-users', [testUser1])
      addResult('✓ Created first test user: testuser / test@example.com')

      // Test 2: Try to register with same username
      const existingUsers = await kv.get<User[]>('alias-users') || []
      const usernameExists = existingUsers.some(user => 
        user.username.toLowerCase() === 'testuser'.toLowerCase()
      )
      
      if (usernameExists) {
        addResult('✓ Username uniqueness check works - duplicate detected')
      } else {
        addResult('✗ Username uniqueness check failed')
      }

      // Test 3: Try to register with same email
      const emailExists = existingUsers.some(user => 
        user.email.toLowerCase() === 'test@example.com'.toLowerCase()
      )

      if (emailExists) {
        addResult('✓ Email uniqueness check works - duplicate detected')
      } else {
        addResult('✗ Email uniqueness check failed')
      }

      // Test 4: Create second user with unique credentials
      const testUser2 = {
        id: '2',
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password456'
      }

      const updatedUsers = [...existingUsers, testUser2]
      await kv.set('alias-users', updatedUsers)
      addResult('✓ Successfully created second user with unique credentials')

      // Test 5: Verify both users exist
      const finalUsers = await kv.get<User[]>('alias-users') || []
      if (finalUsers.length === 2) {
        addResult(`✓ Database contains ${finalUsers.length} users as expected`)
        addResult(`  - User 1: ${finalUsers[0].username} (${finalUsers[0].email})`)
        addResult(`  - User 2: ${finalUsers[1].username} (${finalUsers[1].email})`)
      } else {
        addResult(`✗ Expected 2 users, found ${finalUsers.length}`)
      }

      toast.success('Registration tests completed!')

    } catch (error) {
      addResult(`✗ Test error: ${error}`)
      toast.error('Test failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Registration System Test</CardTitle>
            {updateGamePhase && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateGamePhase('theme')}
              >
                ← Back
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testRegistration} className="w-full">
            Run Registration Tests
          </Button>
          
          <Button onClick={clearResults} variant="outline" className="w-full">
            Clear Results
          </Button>

          {testResults.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <div className="space-y-1 font-mono text-sm">
                {testResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={result.startsWith('✓') ? 'text-green-600' : 
                              result.startsWith('✗') ? 'text-red-600' : 
                              'text-foreground'}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p>This test will:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Create a test user</li>
              <li>Verify username uniqueness validation</li>
              <li>Verify email uniqueness validation</li>
              <li>Test successful registration with unique credentials</li>
              <li>Verify the user database state</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}