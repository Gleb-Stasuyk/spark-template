import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, SkipForward, StopCircle } from '@phosphor-icons/react'
import { Team, GameSettings, GameState } from '../App'
import { getRandomWord } from '../data/wordBanks'

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
  setCurrentWord: (word: string) => void
  setTimeLeft: (time: number) => void
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateTeams: (teams: Team[]) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function GameRound({
  teams,
  settings,
  gameState,
  currentWord,
  timeLeft,
  setCurrentWord,
  setTimeLeft,
  updateGamePhase,
  updateTeams,
  updateGameState
}: GameRoundProps) {
  const [isActive, setIsActive] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [skipCount, setSkipCount] = useState(0)
  const [shakeAnimation, setShakeAnimation] = useState(false)

  const currentTeam = teams[gameState.currentTeam]

  // Generate initial word and auto-start round
  useEffect(() => {
    if (!currentWord && gameState.selectedTheme) {
      setCurrentWord(getRandomWord(gameState.selectedTheme))
    }
    
    // Auto-start the round if it's not active and timer is at full time
    if (!isActive && timeLeft === settings.roundTime) {
      setIsActive(true)
      setCorrectCount(0)
      setSkipCount(0)
      updateGameState({ roundWords: [] })
    }
  }, [currentWord, gameState.selectedTheme, setCurrentWord, isActive, timeLeft, settings.roundTime, updateGameState])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, setTimeLeft])

  const getNextWord = useCallback(() => {
    if (gameState.selectedTheme) {
      setCurrentWord(getRandomWord(gameState.selectedTheme))
    }
  }, [gameState.selectedTheme, setCurrentWord])

  const handleCorrect = () => {
    const newRoundWords = [...gameState.roundWords, { word: currentWord, correct: true }]
    updateGameState({ roundWords: newRoundWords })
    setCorrectCount(prev => prev + 1)
    getNextWord()
    
    // Add pop animation
    const element = document.querySelector('.correct-btn')
    element?.classList.add('animate-score-pop')
    setTimeout(() => element?.classList.remove('animate-score-pop'), 300)
  }

  const handleSkip = () => {
    const newRoundWords = [...gameState.roundWords, { word: currentWord, correct: false }]
    updateGameState({ roundWords: newRoundWords })
    setSkipCount(prev => prev + 1)
    getNextWord()
    
    // Add shake animation
    setShakeAnimation(true)
    setTimeout(() => setShakeAnimation(false), 400)
  }

  const handleTimeUp = () => {
    // Calculate round score
    const roundScore = correctCount - skipCount
    
    // Update team score
    const newTeams = teams.map((team, index) => 
      index === gameState.currentTeam 
        ? { ...team, score: team.score + roundScore }
        : team
    )
    updateTeams(newTeams)

    // Check for victory
    const winningTeam = newTeams.find(team => team.score >= settings.winningScore)
    if (winningTeam) {
      updateGamePhase('victory')
      return
    }

    // Move to results
    updateGamePhase('results')
  }

  const handleEndEarly = () => {
    setIsActive(false)
    handleTimeUp()
  }

  const getTimerColor = () => {
    if (timeLeft > 30) return 'text-success'
    if (timeLeft > 10) return 'text-yellow-500'
    return 'text-destructive'
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className={`px-4 py-2 rounded-full ${currentTeam?.color || 'bg-primary'}`}>
            <span className="text-white font-semibold">{currentTeam?.name}</span>
          </div>
          
          <div className={`text-timer ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
          
          <Button variant="outline" onClick={handleEndEarly} size="sm">
            <StopCircle size={16} className="mr-2" />
            End Early
          </Button>
        </div>

        {/* Current Word */}
        <Card className="mb-8">
          <CardContent className="p-12 text-center">
            <div className={`text-game-word text-foreground ${shakeAnimation ? 'animate-shake' : ''}`}>
              {currentWord}
            </div>
          </CardContent>
        </Card>

        {/* Score Display */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">+{correctCount}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">-{skipCount}</div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {correctCount - skipCount > 0 ? '+' : ''}{correctCount - skipCount}
            </div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-6">
          <Button
            onClick={handleCorrect}
            size="lg"
            className="correct-btn h-20 text-xl bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle size={24} className="mr-3" />
            Correct
          </Button>
          
          <Button
            onClick={handleSkip}
            size="lg"
            variant="destructive"
            className="h-20 text-xl"
          >
            <XCircle size={24} className="mr-3" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  )
}