import {Component, HostBinding, Input} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure} from "../../../model/adventure";
import {MatDialog} from "@angular/material/dialog";
import {DiceService} from "../../../service/dice.service";
import {AuthService} from "../../../../login/auth.service";
import {AdventureService} from "../../../service/adventure.service";
import {Character} from "../../../model/character";
import {AudioService} from "../../../service/audio.service";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  selectedCharacterId: number;

  @Input()
  disableActions: boolean = false;

  @Input()
  adventure: Adventure;

  constructor(private gmService: GmService,
              private adventureService: AdventureService,
              private dialog: MatDialog,
              private diceService: DiceService,
              public authService: AuthService,
              public audioService: AudioService) {
  }

  drawCard() {
    if (!this.disableActions) {
      // Do nothing as get card from websocket
      this.adventureService.drawCard(this.adventure.id);
    }
  }

  rollDices() {
    if (!this.disableActions) {
      this.diceService.openDiceDialog(this.adventure.id);
    }
  }

  selectCharacter(character: Character) {
    if (!this.disableActions) {
      this.adventureService.selectCharacter(this.adventure.id,
        character.id === this.selectedCharacterId ? -1 : character.id);
    }
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
