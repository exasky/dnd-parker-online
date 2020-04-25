import {Component, HostBinding, Input} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure, Initiative} from "../../../model/adventure";
import {MatDialog} from "@angular/material/dialog";
import {DiceService} from "../../../service/dice.service";
import {AuthService} from "../../../../login/auth.service";
import {AdventureService} from "../../../service/adventure.service";
import {Character} from "../../../model/character";
import {AudioService} from "../../../service/audio.service";
import {AdventureCardService} from "../../../service/adventure-card.service";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  selectedCharacterId: number;

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[];

  @Input()
  disableActions: boolean = false;

  @Input()
  adventure: Adventure;

  constructor(private gmService: GmService,
              private adventureService: AdventureService,
              private adventureCardService: AdventureCardService,
              private dialog: MatDialog,
              private diceService: DiceService,
              public authService: AuthService,
              public audioService: AudioService) {
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

  rollInitiative() {
    if (!this.disableActions) {
      this.gmService.rollInitiative(this.adventure.id);
    }
  }

  endTurn() {
    if (!this.disableActions) {
      // this.adventureService.endTurn(this.adventure.id, getCurrentPlayer)
    }
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
