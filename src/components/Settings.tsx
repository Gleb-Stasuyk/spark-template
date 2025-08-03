import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Check, SpeakerHigh, X } from '@phosphor-icons/react'
import { Team, GameSettings, GameState } from '../App'

interface SettingsProps {
  teams: Team[]
  settings: GameSettings
  gameState: GameState
  updateGamePhase: (phase: GameState['gamePhase']) => void
  updateSettings: (settings: GameSettings) => void
}

export default function Settings({ 
  settings, 
  gameState, 
  updateGamePhase, 
  updateSettings 
}: SettingsProps) {
  const handleWinningScoreChange = (value: number[]) => {
    updateSettings({ ...settings, winningScore: value[0] })
  }

  const handleRoundTimeChange = (value: number[]) => {
    updateSettings({ ...settings, roundTime: value[0] })
  }

  const handleSoundVolumeChange = (value: number[]) => {
    updateSettings({ ...settings, soundVolume: value[0] })
  }

  const handlePenaltiesToggle = (checked: boolean) => {
    updateSettings({ ...settings, penaltiesEnabled: checked })
  }

  const handleBack = () => {
    updateGamePhase('theme')
  }

  const handleSave = () => {
    if (gameState.selectedTheme) {
      updateGamePhase('teams')
    } else {
      updateGamePhase('theme')
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Game Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Customize your Alias game experience
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Winning Score
                <span className="text-primary font-bold">{settings.winningScore}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  The first team to reach this score wins (when all teams have played equal rounds)
                </p>
                <Slider
                  value={[settings.winningScore]}
                  onValueChange={handleWinningScoreChange}
                  min={20}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>20 pts</span>
                  <span>Quick Game</span>
                  <span>Long Game</span>
                  <span>100 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Round Time
                <span className="text-primary font-bold">{settings.roundTime}s</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  How long each team has to explain words
                </p>
                <Slider
                  value={[settings.roundTime]}
                  onValueChange={handleRoundTimeChange}
                  min={30}
                  max={120}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30s</span>
                  <span>Fast</span>
                  <span>Relaxed</span>
                  <span>120s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SpeakerHigh size={20} />
                  Sound Volume
                </div>
                <span className="text-primary font-bold">{settings.soundVolume}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Volume for sound effects and feedback
                </p>
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={handleSoundVolumeChange}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>Quiet</span>
                  <span>Loud</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <X size={20} />
                  Penalties for Skipped Words
                </div>
                <Switch
                  checked={settings.penaltiesEnabled}
                  onCheckedChange={handlePenaltiesToggle}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {settings.penaltiesEnabled 
                  ? "Teams lose 1 point for each skipped word" 
                  : "No penalty for skipping words - only gain points for correct answers"
                }
              </p>
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
            onClick={handleSave}
            className="flex items-center gap-2 px-8"
            size="lg"
          >
            <Check size={20} />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}