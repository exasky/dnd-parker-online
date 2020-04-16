import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AudioService {
  private playingSounds: HTMLAudioElement[] = [];

  public volume: number = 0.6;

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
}
