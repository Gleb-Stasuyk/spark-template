import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from 'react-icons/hi2'
import { Team, GameSettings, GameState } from '../App'
import { useState, useEffect } from 'react'

interface RoundResultsProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  setTimeLeft: (time: number) => void
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateGameState: (updates: Partial<GameState>) => void
  updateTeams: (teams: Team[]) => void
}

export default function RoundResults({
  teams,
  settings,
  gameState,
  setTimeLeft,
  updateGamePhase,
  updateGameState,
  updateTeams
}: RoundResultsProps) {
  const currentTeam = teams[gameState.currentTeam]
  
  // Local state for modifiable word results
  const [wordResults, setWordResults] = useState(gameState.roundWords)

  // Update local state when gameState changes
  useEffect(() => {
    setWordResults(gameState.roundWords)
  }, [gameState.roundWords])

  const correctWords = wordResults.filter(w => w.correct)
  const skippedWords = wordResults.filter(w => !w.correct)
  const roundScore = settings.penaltiesEnabled 
    ? correctWords.length - skippedWords.length 
    : correctWords.length

  const handleWordResultChange = (wordIndex: number, isCorrect: boolean) => {
    setWordResults(prevResults => 
      prevResults.map((word, index) => 
        index === wordIndex ? { ...word, correct: isCorrect } : word
      )
    )
  }

  const handleContinue = () => {
    // Update game state with modified word results
    updateGameState({
      roundWords: wordResults
    })

    // Update the current team's rounds played and score
    const updatedTeams = teams.map((team, index) => {
      if (index === gameState.currentTeam) {
        return {
          ...team,
          score: team.score + roundScore,
          roundsPlayed: team.roundsPlayed + 1
        }
      }
      return team
    })
    
    updateTeams(updatedTeams)
    
    // Check if all teams have played equal number of rounds
    const currentTeamRounds = updatedTeams[gameState.currentTeam].roundsPlayed
    const allTeamsEqualRounds = updatedTeams.every(team => team.roundsPlayed === currentTeamRounds)
    
    // Check for victory - only if a team reached winning score AND all teams have equal rounds
    const teamAtWinningScore = updatedTeams.find(team => team.score >= settings.winningScore)
    if (teamAtWinningScore && allTeamsEqualRounds) {
      updateGamePhase('victory')
      return
    }
    
    // Move to next team
    const nextTeam = (gameState.currentTeam + 1) % teams.length
    const nextRound = nextTeam === 0 ? gameState.currentRound + 1 : gameState.currentRound
    
    updateGameState({
      currentTeam: nextTeam,
      currentRound: nextRound,
      roundWords: []
    })
    
    // Reset timer
    setTimeLeft(settings.roundTime)
    
    // Go to game phase
    updateGamePhase('game')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-block px-6 py-3 rounded-full mb-4 ${currentTeam?.color || 'bg-primary'}`}>
            <span className="text-white font-bold text-xl">{currentTeam?.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Round {gameState.currentRound} Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Game Round: {gameState.currentRound}
          </p>
        </div>

        {/* Round Score Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-3xl font-bold mb-2">
                <span className="text-success">+{correctWords.length}</span>
                <span className="text-muted-foreground mx-2">/</span>
                <span className="text-destructive">
                  {settings.penaltiesEnabled ? `-${skippedWords.length}` : skippedWords.length}
                </span>
                <span className="text-muted-foreground mx-2">=</span>
                <span className={roundScore >= 0 ? 'text-success' : 'text-destructive'}>
                  {roundScore > 0 ? '+' : ''}{roundScore}
                </span>
              </div>
              <div className="text-sm text-muted-foreground font-normal">
                Points earned this round{!settings.penaltiesEnabled ? ' (no penalties)' : ''}
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Word Results with Radio Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Word Results
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (You can adjust the results)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wordResults.map((word, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{word.word}</span>
                  </div>
                  <RadioGroup
                    value={word.correct ? 'correct' : 'skipped'}
                    onValueChange={(value) => handleWordResultChange(index, value === 'correct')}
                    className="flex items-center gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="correct" id={`correct-${index}`} />
                      <Label 
                        htmlFor={`correct-${index}`} 
                        className="text-success flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Correct
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skipped" id={`skipped-${index}`} />
                      <Label 
                        htmlFor={`skipped-${index}`} 
                        className="text-destructive flex items-center gap-1 cursor-pointer"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        Skipped
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Word Lists */}
        <div className="space-y-4 mb-8">
          {correctWords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Correct Words ({correctWords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {correctWords.map((word, index) => (
                    <div key={index} className="text-sm bg-success/10 text-success rounded px-3 py-2">
                      {word.word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {skippedWords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <XCircleIcon className="h-5 w-5" />
                  Skipped Words ({skippedWords.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {skippedWords.map((word, index) => (
                    <div key={index} className="text-sm bg-destructive/10 text-destructive rounded px-3 py-2">
                      {word.word}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Scoreboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Current Scores</span>
              <span className="text-sm font-normal text-muted-foreground">
                Game Round: {gameState.currentRound}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teams.map((team, index) => (
                <div key={team.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${team.color}`} />
                      <span className={`font-medium ${index === gameState.currentTeam ? 'text-primary' : 'text-foreground'}`}>
                        {team.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {index === gameState.currentTeam && (
                            <span className="text-xs text-muted-foreground">
                              ({team.score} + {roundScore})
                            </span>
                          )}
                          <span className="font-bold text-lg">
                            {index === gameState.currentTeam ? team.score + roundScore : team.score}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {index === gameState.currentTeam 
                            ? `${team.roundsPlayed + 1} rounds` 
                            : `${team.roundsPlayed} rounds`}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < teams.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={handleContinue} size="lg" className="px-12">
            <ArrowRightIcon className="h-5 w-5 mr-2" />
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}