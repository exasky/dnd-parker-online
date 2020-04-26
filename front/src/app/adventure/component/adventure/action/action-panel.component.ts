import {Component, HostBinding, Input} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure, Initiative} from "../../../model/adventure";
import {MatDialog} from "@angular/material/dialog";
import {DiceService} from "../../../service/dice.service";
import {AuthService} from "../../../../login/auth.service";
import {AdventureService} from "../../../service/adventure.service";
import {AudioService} from "../../../service/audio.service";
import {AdventureCardService} from "../../../service/adventure-card.service";
import {CharacterItem} from "../../../model/item";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[];

  @Input()
  characterItems: CharacterItem[];

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

  get isMyTurn(): boolean {
    return this.authService.currentUserValue.characters.some(char => this.currentInitiative.characterName === char.name);
  }

  rollDices() {
    if (!this.disableActions) {
      this.diceService.openDiceDialog(this.adventure.id);
    }
  }

  rollInitiative() {
    if (!this.disableActions) {
      this.gmService.rollInitiative(this.adventure.id);
    }
  }

  endTurn() {
    if (!this.disableActions) {
      this.adventureService.askNextTurn(this.adventure.id);
    }
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
