import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Character, CharacterEquipment} from "../../../model/character";
import {AudioService} from "../../../service/audio.service";
import {AuthService} from "../../../../login/auth.service";
import {AdventureCardService} from "../../../service/adventure-card.service";
import {CardUtils} from "../../../../common/utils/card-utils";

@Component({
  selector: 'app-drawn-card-dialog',
  templateUrl: './drawn-card-dialog.component.html',
  styleUrls: ['./drawn-card-dialog.component.scss']
})
export class DrawnCardDialogComponent {

  getCardImage = CardUtils.getCardImage;

  public characterName;

  constructor(private audioService: AudioService,
              public authService: AuthService,
              private adventureCardService: AdventureCardService,
              @Inject(MAT_DIALOG_DATA) public data: {
                adventureId: number,
                characterId: number,
                characters: Character[],
                characterItem: CharacterEquipment
              }) {
    this.audioService.playSound('/assets/sound/chest_open_0.mp3');
    this.characterName = data.characters.find(char => char.id === data.characterId).displayName;
  }

  close(validation: boolean) {
    this.adventureCardService.validateDrawnCard(this.data.adventureId, this.data.characterItem.id, validation);
  }
}
