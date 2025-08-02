import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trophy, RotateCcw, House } from '@phosphor-icons/react'
import { Team, GameSettings, GameState } from '../App'

interface VictoryProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  updateGamePhase: (phase: GameState['gamePhase']) => void
  resetGame: () => void
}

export default function Victory({
  teams,
  gameState,
  updateGamePhase,
  resetGame
}: VictoryProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score)
  const winner = sortedTeams[0]

  const handlePlayAgain = () => {
    resetGame()
  }

  const handleMainMenu = () => {
    resetGame()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Victory Animation */}
        <div className="mb-8 animate-celebration">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-5xl font-bold text-foreground mb-2">
            Victory!
          </h1>
        </div>

        {/* Winner Display */}
        <Card className="mb-8 border-2 border-yellow-400 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Trophy size={32} className="text-yellow-500" />
              Winner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`inline-block px-8 py-4 rounded-full mb-4 ${winner?.color || 'bg-primary'}`}>
              <span className="text-white font-bold text-2xl">{winner?.name}</span>
            </div>
            <div className="text-4xl font-bold text-foreground">
              {winner?.score} Points
            </div>
          </CardContent>
        </Card>

        {/* Final Scoreboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Final Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedTeams.map((team, index) => (
                <div key={team.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className={`w-4 h-4 rounded-full ${team.color}`} />
                      <span className="font-medium text-foreground">
                        {team.name}
                      </span>
                      {index === 0 && (
                        <Trophy size={16} className="text-yellow-500" />
                      )}
                    </div>
                    <span className="font-bold text-xl">{team.score}</span>
                  </div>
                  {index < sortedTeams.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePlayAgain}
            size="lg"
            className="flex items-center gap-2 px-8"
          >
            <RotateCcw size={20} />
            Play Again
          </Button>
          
          <Button
            variant="outline"
            onClick={handleMainMenu}
            size="lg"
            className="flex items-center gap-2 px-8"
          >
            <House size={20} />
            Main Menu
          </Button>
        </div>

        {/* Celebration Text */}
        <div className="mt-8 space-y-2">
          <p className="text-lg text-muted-foreground">
            🎊 Congratulations to {winner?.name}! 🎊
          </p>
          <p className="text-sm text-muted-foreground">
            Game completed in {gameState.currentRound} rounds
          </p>
          <p className="text-sm text-muted-foreground">
            Great game everyone! Ready for another round?
          </p>
        </div>
      </div>
    </div>
  )
}