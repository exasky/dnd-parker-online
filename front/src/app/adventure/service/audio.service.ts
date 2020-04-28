import {Injectable} from "@angular/core";

export interface IAudioService {
  getDisplayName(): string;
  playSound(src: string);
  setVolume(volume: number);
  getVolume(): number;
}

@Injectable({
  providedIn: "root"
})
export class AudioService implements IAudioService {
  private playingSounds: HTMLAudioElement[] = [];

  public volume: number = 0.6;

  getDisplayName() {
    return 'Sounds';
  }

  playSound(src: string) {
    const audio = new Audio(src);
    audio.volume = this.volume;

    this.playingSounds.push(audio);
    audio.play().then();
    audio.onended = () => {
      this.playingSounds.splice(this.playingSounds.indexOf(audio), 1);
    }
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.playingSounds.forEach(sound => sound.volume = volume);
  }

  getVolume(): number {
    return this.volume;
  }
}

@Injectable({
  providedIn: "root"
})
export class AmbientAudioService implements IAudioService {
  private ambientSound: HTMLAudioElement;

  public volume: number = 0.6;

  private fadeInOutTime = 2000;
  private fadeInOutIntervalDelay = 100;

  getDisplayName() {
    return 'Ambient';
  }

  playSound(src: string) {
    if (this.ambientSound) {
      const delta = this.volume / (this.fadeInOutTime/this.fadeInOutIntervalDelay);
      const interval = setInterval(() => {
        this.ambientSound.volume -= delta;
        if (this.ambientSound.volume <= 0.01) {
          clearInterval(interval);
          this.launchPlay(src);
        }
      }, 100)
    } else {
      this.launchPlay(src);
    }
  }

  private launchPlay(src: string) {
    const delta = this.volume / (this.fadeInOutTime/this.fadeInOutIntervalDelay);
    this.ambientSound = new Audio(src);
    this.ambientSound.volume = 0;
    this.ambientSound.play();
    const interval = setInterval(() => {
      this.ambientSound.volume += delta;
      if (this.ambientSound.volume >= this.volume) {
        clearInterval(interval);
      }
    }, 100);
  }

  setVolume(volume: number) {
    this.volume = volume;
    this.ambientSound.volume = volume;
  }

  getVolume(): number {
    return this.volume;
  }
}
