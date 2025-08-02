import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, EyeOff, UserPlus, LogIn } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AuthProps {
  onAuthSuccess: (user: { id: string; username: string; email: string }) => void
}

interface User {
  id: string
  username: string
  email: string
  password: string
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  // Login form state
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Registration form state
  const [regUsername, setRegUsername] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  
  // UI state
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const handleRegister = async () => {
    // Validation checks before setting loading state
    if (!regUsername.trim()) {
      toast.error('Username is required')
      return
    }

    if (!validateEmail(regEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validatePassword(regPassword)) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Get existing users
      const existingUsers = await spark.kv.get<User[]>('alias-users') || []
      
      // Check if username or email already exists
      const usernameExists = existingUsers.some(user => user.username.toLowerCase() === regUsername.toLowerCase())
      const emailExists = existingUsers.some(user => user.email.toLowerCase() === regEmail.toLowerCase())

      if (usernameExists) {
        toast.error('Username already exists')
        setIsLoading(false)
        return
      }

      if (emailExists) {
        toast.error('Email already registered')
        setIsLoading(false)
        return
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username: regUsername.trim(),
        email: regEmail.toLowerCase().trim(),
        password: regPassword // In a real app, this would be hashed
      }

      // Save user
      const updatedUsers = [...existingUsers, newUser]
      await spark.kv.set('alias-users', updatedUsers)

      toast.success('Registration successful!')

      // Clear form
      setRegUsername('')
      setRegEmail('')
      setRegPassword('')
      setRegConfirmPassword('')

      // Auto-login after registration
      onAuthSuccess({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      })

    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    // Validation checks before setting loading state
    if (!loginUsername.trim()) {
      toast.error('Username is required')
      return
    }

    if (!loginPassword) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const existingUsers = await spark.kv.get<User[]>('alias-users') || []
      
      // Find user by username or email
      const user = existingUsers.find(u => 
        u.username.toLowerCase() === loginUsername.toLowerCase() || 
        u.email.toLowerCase() === loginUsername.toLowerCase()
      )

      if (!user || user.password !== loginPassword) {
        toast.error('Invalid username/email or password')
        setIsLoading(false)
        return
      }

      toast.success(`Welcome back, ${user.username}!`)

      // Clear form
      setLoginUsername('')
      setLoginPassword('')

      onAuthSuccess({
        id: user.id,
        username: user.username,
        email: user.email
      })

    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Alias Game
          </CardTitle>
          <CardDescription>
            Sign in to access custom word collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn size={16} />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2">
                <UserPlus size={16} />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-username">Username or Email</Label>
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Enter username or email"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    disabled={isLoading}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleLogin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Username</Label>
                <Input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Create a password (min 6 characters)"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    disabled={isLoading}
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleRegister} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}