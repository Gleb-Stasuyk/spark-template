import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircleIcon, XCircleIcon, ForwardIcon, StopCircleIcon, HomeIcon } from 'react-icons/hi2'
import { Team, GameSettings, GameState, AuthUser } from '../App'
import { getRandomWord, isAdultTheme } from '../data/wordBanks'
import { SoundUtils } from '../utils/soundUtils'

// Utility function to format time
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

interface GameRoundProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  currentWord: string
  timeLeft: number
  currentUser: AuthUser | null
  setCurrentWord: (word: string) => void
  setTimeLeft: (time: number) => void
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateTeams: (teams: Team[]) => void
  updateGameState: (updates: Partial<GameState>) => void
  resetGame: () => void
}

export default function GameRound({
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
  updateGameState,
  resetGame
}: GameRoundProps) {
  const [isActive, setIsActive] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [skipCount, setSkipCount] = useState(0)
  const [shakeAnimation, setShakeAnimation] = useState(false)
  const [correctAnimation, setCorrectAnimation] = useState(false)
  const [hasPlayedTimeWarning, setHasPlayedTimeWarning] = useState(false)
  const [hasPlayedFinalCountdown, setHasPlayedFinalCountdown] = useState(false)

  const currentTeam = teams[gameState.currentTeam]

  // Security check: prevent unauthorized access to adult themes
  if (isAdultTheme(gameState.selectedTheme) && !currentUser) {
    updateGamePhase('auth')
    return null
  }

  // Generate initial word and auto-start round
  useEffect(() => {
    const initializeWord = async () => {
      if (!currentWord && gameState.selectedTheme) {
        const word = await getRandomWord(gameState.selectedTheme)
        setCurrentWord(word)
      }
    }
    
    initializeWord()
    
    // Auto-start the round if it's not active and timer is at full time
    if (!isActive && timeLeft === settings.roundTime) {
      setIsActive(true)
      setCorrectCount(0)
      setSkipCount(0)
      setHasPlayedTimeWarning(false)
      setHasPlayedFinalCountdown(false)
      updateGameState({ roundWords: [] })
      
      // Initialize audio context on first interaction
      SoundUtils.initializeAudio()
      SoundUtils.setVolume(settings.soundVolume)
    }
  }, [currentWord, gameState.selectedTheme, setCurrentWord, isActive, timeLeft, settings.roundTime, updateGameState])

  // Update sound volume when settings change
  useEffect(() => {
    SoundUtils.setVolume(settings.soundVolume)
  }, [settings.soundVolume])

  // Timer logic with sound effects
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0) {
      // Play warning sounds at specific intervals
      if (timeLeft === 10 && !hasPlayedTimeWarning) {
        SoundUtils.playTimeWarningSound()
        setHasPlayedTimeWarning(true)
      }
      
      if (timeLeft <= 5 && timeLeft > 0 && !hasPlayedFinalCountdown) {
        SoundUtils.playFinalCountdownSound()
        setHasPlayedFinalCountdown(true)
      }
      
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1
          
          // Play countdown sounds for last 5 seconds
          if (newTime <= 5 && newTime > 0) {
            SoundUtils.playFinalCountdownSound()
          }
          
          if (newTime <= 0) {
            setIsActive(false)
            handleTimeUp()
            return 0
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, setTimeLeft, hasPlayedTimeWarning, hasPlayedFinalCountdown])

  const getNextWord = useCallback(async () => {
    if (gameState.selectedTheme) {
      const word = await getRandomWord(gameState.selectedTheme)
      setCurrentWord(word)
    }
  }, [gameState.selectedTheme, setCurrentWord])

  const handleCorrect = () => {
    const newRoundWords = [...gameState.roundWords, { word: currentWord, correct: true }]
    updateGameState({ roundWords: newRoundWords })
    setCorrectCount(prev => prev + 1)
    getNextWord()
    
    // Play success sound
    SoundUtils.playSuccessSound()
    
    // Add success animation
    setCorrectAnimation(true)
    setTimeout(() => setCorrectAnimation(false), 600)
  }

  const handleSkip = () => {
    const newRoundWords = [...gameState.roundWords, { word: currentWord, correct: false }]
    updateGameState({ roundWords: newRoundWords })
    setSkipCount(prev => prev + 1)
    getNextWord()
    
    // Play error sound
    SoundUtils.playErrorSound()
    
    // Add shake animation
    setShakeAnimation(true)
    setTimeout(() => setShakeAnimation(false), 400)
  }

  const handleTimeUp = () => {
    // Check for victory in the updated teams (will be done in RoundResults)
    // Move to results
    updateGamePhase('results')
  }

  const handleMainMenu = () => {
    resetGame()
  }

  const handleEndEarly = () => {
    setIsActive(false)
    handleTimeUp()
  }

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-success'
    if (timeLeft > 10) return 'text-yellow-500'
    return 'text-destructive animate-pulse'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleMainMenu} size="sm">
              <HomeIcon className="h-4 w-4 mr-2" />
              Main Menu
            </Button>
            <div className={`px-4 py-2 rounded-full ${currentTeam?.color || 'bg-primary'}`}>
              <span className="text-white font-semibold">{currentTeam?.name}</span>
            </div>
          </div>
          
          <div className={`text-timer ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          
          <Button variant="outline" onClick={handleEndEarly} size="sm">
            <StopCircleIcon className="h-4 w-4 mr-2" />
            End Early
          </Button>
        </div>

        {/* Current Word */}
        <Card className={`mb-8 transition-all duration-300 ${correctAnimation ? 'animate-celebration bg-success/10 border-success' : ''}`}>
          <CardContent className="p-12 text-center">
            <div className={`text-game-word text-foreground transition-all duration-300 ${
              shakeAnimation ? 'animate-shake' : ''
            } ${correctAnimation ? 'text-success' : ''}`}>
              {currentWord}
            </div>
          </CardContent>
        </Card>

        {/* Score Display */}
        <div className="flex justify-center gap-8 mb-8">
          <div className={`text-center transition-all duration-300 ${correctAnimation ? 'animate-score-pop' : ''}`}>
            <div className="text-3xl font-bold text-success">+{correctCount}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className={`text-center transition-all duration-300 ${shakeAnimation ? 'animate-shake' : ''}`}>
            <div className="text-3xl font-bold text-destructive">
              {settings.penaltiesEnabled ? `-${skipCount}` : skipCount}
            </div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {(settings.penaltiesEnabled ? correctCount - skipCount : correctCount) > 0 ? '+' : ''}{settings.penaltiesEnabled ? correctCount - skipCount : correctCount}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-6">
          <Button
            onClick={handleCorrect}
            size="lg"
            className={`h-20 text-xl bg-success hover:bg-success/90 text-success-foreground transition-all duration-200 ${
              correctAnimation ? 'animate-score-pop scale-105' : 'hover:scale-105'
            }`}
          >
            <CheckCircleIcon className="h-6 w-6 mr-3" />
            Correct
          </Button>
          
          <Button
            onClick={handleSkip}
            size="lg"
            variant="destructive"
            className={`h-20 text-xl transition-all duration-200 ${
              shakeAnimation ? 'animate-shake' : 'hover:scale-105'
            }`}
          >
            <XCircleIcon className="h-6 w-6 mr-3" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}