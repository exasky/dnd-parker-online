import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Character, CharacterItem} from "../../../model/character";
import {AudioService} from "../../../service/audio.service";
import {AuthService} from "../../../../login/auth.service";
import {AdventureCardService} from "../../../service/adventure-card.service";

@Component({
  selector: 'app-drawn-card-dialog',
  templateUrl: './drawn-card-dialog.component.html',
  styleUrls: ['./draw-card-dialog.component.scss']
})
export class DrawnCardDialogComponent {

  public characterName;

  constructor(private audioService: AudioService,
              public authService: AuthService,
              private adventureCardService: AdventureCardService,
              @Inject(MAT_DIALOG_DATA) public data: {
                adventureId: number,
                characterId: number,
                characters: Character[],
                characterItem: CharacterItem
              }) {
    this.audioService.playSound('/assets/sound/chest_open_0.mp3');
    this.characterName = data.characters.find(char => char.id === data.characterId).displayName;
  }

  close(validation: boolean) {
    this.adventureCardService.validateDrawnCard(this.data.adventureId, this.data.characterItem.id, validation);
  }
}
