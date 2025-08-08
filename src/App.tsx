import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from '@/components/ui/sonner'
import ThemeSelection from './components/ThemeSelection'
import Settings from './components/Settings'
import TeamSetup from './components/TeamSetup'
import GameRound from './components/GameRound'
import RoundResults from './components/RoundResults'
import Victory from './components/Victory'
import Rules from './components/Rules'
import Auth from './components/Auth'

import { isAdultTheme } from './data/wordBanks'

export interface Team {
  id: number
  name: string
  score: number
  color: string
  roundsPlayed: number
}

export interface GameSettings {
  winningScore: number
  roundTime: number
  soundVolume: number
  penaltiesEnabled: boolean
}

export interface GameState {
  currentTeam: number
  currentRound: number
  roundWords: Array<{ word: string; correct: boolean | null }>
  gamePhase: 'auth' | 'theme' | 'settings' | 'teams' | 'game' | 'results' | 'victory' | 'rules'
  selectedTheme: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
}

function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useKV<AuthUser | null>('alias-current-user', null)
  
  // Persistent game data
  const [teams, setTeams] = useKV<Team[]>('alias-teams', [])
  const [settings, setSettings] = useKV<GameSettings>('alias-settings', {
    winningScore: 50,
    roundTime: 60,
    soundVolume: 50,
    penaltiesEnabled: true
  })
  const [gameState, setGameState] = useKV<GameState>('alias-game-state', {
    currentTeam: 0,
    currentRound: 1,
    roundWords: [],
    gamePhase: 'theme',
    selectedTheme: ''
  })

  // Session state
  const [currentWord, setCurrentWord] = useState('')
  const [timeLeft, setTimeLeft] = useState(settings.roundTime)

  // Migrate existing teams to include roundsPlayed field
  useEffect(() => {
    if (teams.length > 0 && teams.some(team => typeof team.roundsPlayed === 'undefined')) {
      setTeams(currentTeams => 
        currentTeams.map(team => ({
          ...team,
          roundsPlayed: team.roundsPlayed || 0
        }))
      )
    }
  }, [teams, setTeams])

  const updateGamePhase = (phase: GameState['gamePhase']) => {
    setGameState(current => ({ ...current, gamePhase: phase }))
  }

  const updateTeams = (newTeams: Team[]) => {
    setTeams(newTeams)
  }

  const updateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings)
    setTimeLeft(newSettings.roundTime)
  }

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(current => ({ ...current, ...updates }))
  }

  const resetGame = () => {
    setTeams([])
    setGameState({
      currentTeam: 0,
      currentRound: 1,
      roundWords: [],
      gamePhase: 'theme',
      selectedTheme: ''
    })
    setCurrentWord('')
    setTimeLeft(settings.roundTime)
  }

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user)
    setGameState(current => ({ ...current, gamePhase: 'theme' }))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    resetGame()
    setGameState(current => ({ ...current, gamePhase: 'theme' }))
  }

  // Show auth screen if no user is logged in and user tries to access custom collections or adult themes
  if (!currentUser && (gameState.selectedTheme === 'custom' || isAdultTheme(gameState.selectedTheme))) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  const props = {
    teams,
    settings,
    gameState,
    currentWord,
    timeLeft,
    currentUser,
    setCurrentWord,
    setTimeLeft,
    updateGamePhase,
    updateTeams,
    updateSettings,
    updateGameState,
    resetGame,
    handleLogout
  }

  switch (gameState.gamePhase) {
    case 'auth':
      return (
        <>
          <Auth onAuthSuccess={handleAuthSuccess} />
          <Toaster />
        </>
      )
    case 'theme':
      return (
        <>
          <ThemeSelection {...props} />
          <Toaster />
        </>
      )
    case 'settings':
      return (
        <>
          <Settings {...props} />
          <Toaster />
        </>
      )
    case 'rules':
      return (
        <>
          <Rules {...props} />
          <Toaster />
        </>
      )
    case 'teams':
      return (
        <>
          <TeamSetup {...props} />
          <Toaster />
        </>
      )
    case 'game':
      return (
        <>
          <GameRound {...props} />
          <Toaster />
        </>
      )
    case 'results':
      return (
        <>
          <RoundResults {...props} />
          <Toaster />
        </>
      )
    case 'victory':
      return (
        <>
          <Victory {...props} />
          <Toaster />
        </>
      )
    default:
      return (
        <>
          <ThemeSelection {...props} />
          <Toaster />
        </>
      )
  }
}

export default App