import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import ThemeSelection from './components/ThemeSelection'
import Settings from './components/Settings'
import TeamSetup from './components/TeamSetup'
import GameRound from './components/GameRound'
import RoundResults from './components/RoundResults'
import Victory from './components/Victory'
import Rules from './components/Rules'

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
}

export interface GameState {
  currentTeam: number
  currentRound: number
  roundWords: Array<{ word: string; correct: boolean | null }>
  gamePhase: 'theme' | 'settings' | 'teams' | 'game' | 'results' | 'victory' | 'rules'
  selectedTheme: string
}

function App() {
  // Persistent game data
  const [teams, setTeams] = useKV<Team[]>('alias-teams', [])
  const [settings, setSettings] = useKV<GameSettings>('alias-settings', {
    winningScore: 50,
    roundTime: 60
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
      const migratedTeams = teams.map(team => ({
        ...team,
        roundsPlayed: team.roundsPlayed || 0
      }))
      setTeams(migratedTeams)
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

  const props = {
    teams,
    settings,
    gameState,
    currentWord,
    timeLeft,
    setCurrentWord,
    setTimeLeft,
    updateGamePhase,
    updateTeams,
    updateSettings,
    updateGameState,
    resetGame
  }

  switch (gameState.gamePhase) {
    case 'theme':
      return <ThemeSelection {...props} />
    case 'settings':
      return <Settings {...props} />
    case 'rules':
      return <Rules {...props} />
    case 'teams':
      return <TeamSetup {...props} />
    case 'game':
      return <GameRound {...props} />
    case 'results':
      return <RoundResults {...props} />
    case 'victory':
      return <Victory {...props} />
    default:
      return <ThemeSelection {...props} />
  }
}

export default App