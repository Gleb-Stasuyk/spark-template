import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@phosphor-icons/react'

import { Team, GameSettings, GameState } from '../App'

interface RulesProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateGameState: (updates: Partial<GameState>) => void
}

export default function Rules({ 
  updateGamePhase
}: RulesProps) {
  const handleBack = () => {
    updateGamePhase('theme')
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            How to Play Alias
          </h1>
          <p className="text-muted-foreground text-lg">
            A fun team-based word explanation game
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Game Overview */}
          <Card>
            <CardHeader>
              <CardTitle>
                👥 Game Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Alias is a team-based word explanation game where players try to help their teammates guess words without using the actual word or its direct translations.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary">•</span>
                  <span>2-6 teams can play</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary">•</span>
                  <span>Minimum 2 players per team</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-semibold text-primary">•</span>
                  <span>One player explains, teammates guess</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Round Process */}
          <Card>
            <CardHeader>
              <CardTitle>
                ⏰ Round Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                  <span>A random player becomes the explainer</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Timer starts (60 seconds by default)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Explainer describes words to teammates</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                  <span>Points are calculated at the end</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card>
            <CardHeader>
              <CardTitle>
                🏆 Scoring System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                  <span className="h-5 w-5 text-success">✅</span>
                  <div>
                    <div className="font-semibold text-success">Correct Guess</div>
                    <div className="text-sm text-muted-foreground">+1 point</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
                  <span className="h-5 w-5 text-destructive">❌</span>
                  <div>
                    <div className="font-semibold text-destructive">Skip or Wrong</div>
                    <div className="text-sm text-muted-foreground">-1 point</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The first team to reach the winning score (default: 50 points) wins the game, but only after all teams have played an equal number of rounds!
              </p>
            </CardContent>
          </Card>

          {/* Victory Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>
                🏆 Victory Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="font-semibold text-primary mb-2">How to Win:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Be the first team to reach the winning score (default: 50 points)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span><strong>AND</strong> ensure all teams have played an equal number of rounds</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This ensures fair play - if a team reaches the winning score but other teams haven't had their turn in that round, the game continues until everyone has played equally.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rules for Explainers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-accent">
                Rules for Explainers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-destructive">❌ Not allowed:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Using the actual word</li>
                  <li>• Using direct translations</li>
                  <li>• Using cognates (similar sounding words)</li>
                  <li>• Gestures or pointing</li>
                  <li>• Saying "sounds like" or "rhymes with"</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-success">✅ Allowed:</h4>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Describing what it is</li>
                  <li>• Explaining its purpose</li>
                  <li>• Using synonyms</li>
                  <li>• Describing its appearance</li>
                  <li>• Giving examples or context</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-6 flex items-center gap-2"
            size="lg"
          >
            <ArrowLeft />
            Back to Game Setup
          </Button>
        </div>
      </div>
    </div>
  )
}