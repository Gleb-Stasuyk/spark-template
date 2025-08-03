// Sound utility for creating and playing audio feedback
export class SoundUtils {
  private static audioContext: AudioContext | null = null
  private static volume: number = 0.5 // Default 50%

  private static getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Set the global volume (0-1)
  static setVolume(volumePercent: number): void {
    this.volume = Math.max(0, Math.min(1, volumePercent / 100))
  }

  // Play a success sound for correct answers
  static playSuccessSound(): void {
    if (this.volume === 0) return
    
    try {
      const audioContext = this.getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Create a pleasant ascending tone
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5

      gainNode.gain.setValueAtTime(0.3 * this.volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.3)

      oscillator.type = 'sine'
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Could not play success sound:', error)
    }
  }

  // Play an error sound for skipped/incorrect answers
  static playErrorSound(): void {
    if (this.volume === 0) return
    
    try {
      const audioContext = this.getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Create a descending tone
      oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime) // G4
      oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.15) // E4

      gainNode.gain.setValueAtTime(0.2 * this.volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.25)

      oscillator.type = 'triangle'
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.25)
    } catch (error) {
      console.warn('Could not play error sound:', error)
    }
  }

  // Play a time warning sound
  static playTimeWarningSound(): void {
    if (this.volume === 0) return
    
    try {
      const audioContext = this.getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Quick beep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.15 * this.volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.1)

      oscillator.type = 'square'
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      console.warn('Could not play time warning sound:', error)
    }
  }

  // Play a final countdown sound
  static playFinalCountdownSound(): void {
    if (this.volume === 0) return
    
    try {
      const audioContext = this.getAudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Urgent beep
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.25 * this.volume, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.volume, audioContext.currentTime + 0.2)

      oscillator.type = 'sawtooth'
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.warn('Could not play final countdown sound:', error)
    }
  }

  // Initialize audio context (should be called on user interaction)
  static initializeAudio(): void {
    try {
      const audioContext = this.getAudioContext()
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
    } catch (error) {
      console.warn('Could not initialize audio:', error)
    }
  }
}