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
import {Character} from "../../../model/character";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[] = [];

  sortedCharacterItems: CharacterItem[] = [];

  @Input()
  set characterItems(characterItems: CharacterItem[]) {
    this.sortCharactersByInitiative(characterItems);
  }

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

  private sortCharactersByInitiative(characterItems: CharacterItem[]) {
    this.initiatives.forEach((init, idx) => {
      const characterItem = characterItems.find(charItem => charItem.character.name === init.characterName);
      this.sortedCharacterItems[idx] = characterItem ? characterItem : ({character: {name: 'game-master'}}) as unknown as CharacterItem;
    });
  }

  get isMyTurn(): boolean {
    if (!this.currentInitiative) return false;
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

  getCharacterTooltipHeight(character: Character) {
    return Math.max(600,
      Math.min(2, Math.max(character.equippedItems.length, character.backpackItems.length)) * 300);
  }
}
