import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Play } from '@phosphor-icons/react'
import { Team, GameSettings, GameState } from '../App'

const TEAM_COLORS = [
  'team-color-1', // Electric Blue
  'team-color-2', // Coral Red  
  'team-color-3', // Lime Green
  'team-color-4'  // Golden Yellow
]

interface TeamSetupProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateTeams: (teams: Team[]) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function TeamSetup({ 
  teams,
  gameState,
  updateGamePhase, 
  updateTeams,
  updateGameState
}: TeamSetupProps) {
  const [selectedTeamCount, setSelectedTeamCount] = useState(teams.length || 2)
  const [teamNames, setTeamNames] = useState<string[]>(
    teams.length > 0 
      ? teams.map(t => t.name)
      : Array(4).fill('').map((_, i) => `Team ${i + 1}`)
  )

  const handleTeamCountSelect = (count: number) => {
    setSelectedTeamCount(count)
    // Ensure we have enough default names
    const newNames = [...teamNames]
    for (let i = newNames.length; i < count; i++) {
      newNames[i] = `Team ${i + 1}`
    }
    setTeamNames(newNames)
  }

  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames]
    newNames[index] = name
    setTeamNames(newNames)
  }

  const handleBack = () => {
    updateGamePhase('theme')
  }

  const handleStartGame = () => {
    const newTeams: Team[] = Array(selectedTeamCount).fill(null).map((_, i) => ({
      id: i,
      name: teamNames[i] || `Team ${i + 1}`,
      score: 0,
      color: TEAM_COLORS[i]
    }))
    
    updateTeams(newTeams)
    updateGameState({ 
      currentTeam: 0,
      currentRound: 1,
      roundWords: []
    })
    updateGamePhase('game')
  }

  const isValidSetup = selectedTeamCount >= 2 && 
    teamNames.slice(0, selectedTeamCount).every(name => name.trim().length > 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            How many teams are playing?
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the number of teams and enter their names
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {/* Team Count Selection */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Number of Teams</h3>
              <div className="grid grid-cols-3 gap-3">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    variant={selectedTeamCount === count ? "default" : "outline"}
                    onClick={() => handleTeamCountSelect(count)}
                    className="h-12 text-lg"
                  >
                    {count} Teams
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Names */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Team Names</h3>
              <div className="space-y-3">
                {Array(selectedTeamCount).fill(null).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${TEAM_COLORS[i]}`} />
                    <Input
                      placeholder={`Team ${i + 1}`}
                      value={teamNames[i]}
                      onChange={(e) => handleTeamNameChange(i, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back
          </Button>

          <Button
            onClick={handleStartGame}
            disabled={!isValidSetup}
            className="flex items-center gap-2 px-8"
            size="lg"
          >
            <Play size={20} />
            Start Game
          </Button>
        </div>
      </div>
    </div>
  )
}