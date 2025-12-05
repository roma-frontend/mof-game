// lib/sounds/soundManager.ts
export class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private loaded: boolean = false;

  private constructor() {
    this.preloadSounds();
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async preloadSounds() {
    // Проверяем, если уже загружено
    if (this.loaded) return;

    const soundFiles = {
      buttonClick: '/sounds/effects/click.mp3',
      teamCreated: '/sounds/effects/team-created.mp3',
      playerAdded: '/sounds/effects/player-added.mp3',
      puzzleSolved: '/sounds/effects/puzzle-solved.mp3',
      levelComplete: '/sounds/effects/level-complete.mp3',
      error: '/sounds/effects/error.mp3',
      ambientOffice: '/sounds/ambient/office.mp3',
      ambientKitchen: '/sounds/ambient/kitchen.mp3',
      ambientMeeting: '/sounds/ambient/meeting-room.mp3',
      mainTheme: '/sounds/music/main-theme.mp3',
      tension: '/sounds/music/tension.mp3',
      victory: '/sounds/music/victory.mp3',
    };

    // Создаем звуки асинхронно
    const loadPromises = Object.entries(soundFiles).map(([key, path]) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audio.addEventListener('canplaythrough', () => {
          this.sounds.set(key, audio);
          resolve();
        }, { once: true });
        
        // Фолбэк на случай ошибки загрузки
        audio.addEventListener('error', () => {
          console.warn(`Не удалось загрузить звук: ${key}`);
          this.sounds.set(key, audio);
          resolve();
        }, { once: true });
      });
    });

    await Promise.all(loadPromises);
    this.loaded = true;
    console.log('Все звуки загружены');
  }

  play(soundName: string, options?: { volume?: number; loop?: boolean; reset?: boolean }) {
    if (this.isMuted) return null;

    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`Звук не найден: ${soundName}`);
      return null;
    }

    const volume = options?.volume !== undefined ? options.volume : this.volume;
    const shouldLoop = options?.loop || false;
    
    if (options?.reset !== false) {
      sound.currentTime = 0;
    }
    
    sound.volume = volume;
    sound.loop = shouldLoop;
    
    const playPromise = sound.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Ошибка воспроизведения звука:', e);
      });
    }
    
    return sound;
  }

  stop(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopAll() {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    // Обновляем громкость только для неиграющих звуков
    this.sounds.forEach(sound => {
      if (sound.paused) {
        sound.volume = this.volume;
      }
    });
  }

  isSoundPlaying(soundName: string): boolean {
    const sound = this.sounds.get(soundName);
    return sound ? !sound.paused && sound.currentTime > 0 : false;
  }
}

// React хук для звуков
export const useSound = () => {
  const soundManager = SoundManager.getInstance();

  return {
    playClick: () => soundManager.play('buttonClick'),
    playTeamCreated: () => soundManager.play('teamCreated'),
    playPlayerAdded: () => soundManager.play('playerAdded'),
    playPuzzleSolved: () => soundManager.play('puzzleSolved'),
    playLevelComplete: () => soundManager.play('levelComplete'),
    playError: () => soundManager.play('error'),
    startAmbient: (room: string) => {
      // Останавливаем все предыдущие ambient звуки
      soundManager.stop('ambientOffice');
      soundManager.stop('ambientKitchen');
      soundManager.stop('ambientMeeting');
      
      switch(room) {
        case 'office': 
          soundManager.play('ambientOffice', { loop: true }); 
          break;
        case 'kitchen': 
          soundManager.play('ambientKitchen', { loop: true }); 
          break;
        case 'meeting': 
          soundManager.play('ambientMeeting', { loop: true }); 
          break;
        default:
          soundManager.play('ambientOffice', { loop: true });
      }
    },
    stopAmbient: () => {
      soundManager.stop('ambientOffice');
      soundManager.stop('ambientKitchen');
      soundManager.stop('ambientMeeting');
    },
    setMuted: (muted: boolean) => soundManager.setMuted(muted),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    playVictory: () => soundManager.play('victory'),
    playTension: () => soundManager.play('tension'),
  };
};