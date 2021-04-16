import {Component, Input} from "@angular/core";
import {AmbientAudioService, AudioService} from "../../../service/audio.service";
import {DiceService} from "../../../service/dice.service";
import {Adventure, Initiative} from "../../../model/adventure";
import {CharacterItem} from "../../../model/item";
import {Character} from "../../../model/character";
import {AdventureService} from "../../../service/adventure.service";
import {AuthService} from "../../../../login/auth.service";

@Component({
  selector: 'app-top-action-panel-right',
  templateUrl: './top-action-panel-right.component.html',
  // styleUrls: ['./top-action-panel-left.component.scss']
})
export class TopActionPanelRightComponent {
  @Input()
  adventure: Adventure;

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[] = [];

  disableActions: boolean = false;

  constructor(private adventureService: AdventureService,
              private diceService: DiceService,
              public authService: AuthService,
              public audioService: AudioService,
              public ambientAudioService: AmbientAudioService,) {
  }

  rollDices() {
    if (!this.disableActions) this.diceService.openDiceDialog(this.adventure.id);
  }

  get isMyTurn(): boolean {
    if (!this.currentInitiative) return false;
    return this.authService.currentUserValue.characters.some(char => this.currentInitiative.characterName === char.name);
  }

  endTurn() {
    if (!this.disableActions) this.adventureService.askNextTurn(this.adventure.id);
  }
}
