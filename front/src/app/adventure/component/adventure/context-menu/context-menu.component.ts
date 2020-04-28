import {Component, Input, ViewChild} from "@angular/core";
import {MatMenuTrigger} from "@angular/material/menu";
import {
  CharacterLayerGridsterItem,
  ChestLayerGridsterItem,
  DoorLayerGridsterItem,
  LayerGridsterItem,
  MonsterLayerGridsterItem,
  TrapLayerGridsterItem
} from "../../../model/layer-gridster-item";
import {Initiative, LayerElement, LayerElementType} from "../../../model/adventure";
import {AuthService} from "../../../../login/auth.service";
import {AdventureService} from "../../../service/adventure.service";
import {GmService} from "../../../service/gm.service";
import {DialogUtils} from "../../../../common/dialog/dialog.utils";
import {MatDialog} from "@angular/material/dialog";
import {SelectCardDialogComponent} from "./dialog/select-card-dialog.component";
import {AdventureCardService} from "../../../service/adventure-card.service";
import {AdventureUtils} from "../utils/utils";
import {CharacterEquipment} from "../../../model/character";
import {DiceService} from "../../../service/dice.service";

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html'
})
export class ContextMenuComponent {
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @Input()
  adventureId: number;

  @Input()
  addableLayerElements: LayerElement[] = [];

  @Input()
  characterItems: CharacterLayerGridsterItem[];

  @Input()
  currentInitiative: Initiative;

  @Input()
  selectedMonsterId: number;

  LayerElementType = LayerElementType;

  contextMenuPosition = {x: '0px', y: '0px'};

  constructor(public authService: AuthService,
              private adventureService: AdventureService,
              private adventureCardService: AdventureCardService,
              private gmService: GmService,
              private diceService: DiceService,
              private dialog: MatDialog) {
  }

  openMenu(event: MouseEvent, item: LayerGridsterItem) {
    if (this.isContextMenuEnabled(item)) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = {'item': item};
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  private isContextMenuEnabled(item: LayerGridsterItem) {
    return this.authService.isGM
      || item.type === LayerElementType.CHEST
      || ([LayerElementType.MONSTER, LayerElementType.CHARACTER].indexOf(item.type) !== -1 && AdventureUtils.isMyTurn(this.authService.currentUserValue, this.currentInitiative));
  }

  isItemFlippable(type: LayerElementType) {
    return [LayerElementType.TRAP, LayerElementType.DOOR].indexOf(type) !== -1;
  }

  flipElement(item: LayerGridsterItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    switch (item.type) {
      case LayerElementType.TRAP:
        const trapGridsterItem = item as TrapLayerGridsterItem;
        trapGridsterItem.shown = false;
        trapGridsterItem.deactivated = !trapGridsterItem.deactivated;
        break;
      case LayerElementType.DOOR:
        const doorGridsterItem = item as DoorLayerGridsterItem;
        doorGridsterItem.open = !doorGridsterItem.open;
        this.gmService.playSound(this.adventureId, 'door_' + (doorGridsterItem.open ? 'open' : 'close') + '_0.mp3');
        break;
    }

    this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  showTrap(item: TrapLayerGridsterItem) {
    item.shown = true;
    this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  openChest(item: ChestLayerGridsterItem) {
    const currCharItem = this.characterItems.find(char => char.character.userId === this.authService.currentUserValue.id);
    if (item.specificCard) {
      this.adventureCardService.drawCard(this.adventureId, currCharItem.character.id, item.specificCard.id);
      // this.adventureService.deleteLayerItem(this.adventureId, item.id);
      // TODO remove chest only if mj accepted
    } else {
      if (currCharItem) {
        this.adventureCardService.drawCard(this.adventureId, currCharItem.character.id);
        // this.adventureService.deleteLayerItem(this.adventureId, item.id);
        // TODO remove chest only if mj accepted
      }
    }
  }

  deleteItem(item: LayerGridsterItem) {
    this.adventureService.deleteLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  setChestCard(item: ChestLayerGridsterItem) {
    this.dialog.open(SelectCardDialogComponent, DialogUtils.getDefaultConfig(item['cardId']))
      .afterClosed().subscribe((value: CharacterEquipment) => {
      item.specificCard = value;
      this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
    });
  }

  attackMonster(item: MonsterLayerGridsterItem) {
    const fromAttack = this.authService.currentUserValue.characters.find(char => char.name === this.currentInitiative.characterName);
    const fromAttackId = fromAttack ? fromAttack.id : this.selectedMonsterId;
    this.diceService.openDiceAttackDialog(this.adventureId, fromAttackId, item.id, !fromAttack, true);
  }

  attackCharacter(item: CharacterLayerGridsterItem) {
    const fromAttack = this.authService.currentUserValue.characters.find(char => char.name === this.currentInitiative.characterName);
    const fromAttackId = fromAttack ? fromAttack.id : this.selectedMonsterId;
    this.diceService.openDiceAttackDialog(this.adventureId, fromAttackId, item.id, !fromAttack, false);
  }

  canTradeWith(item: CharacterLayerGridsterItem): boolean {
    const currChar = this.characterItems.find(char => char.character.name === this.currentInitiative.characterName);
    // return item.x - currChar.x > 1;
    return item.character.name !== this.currentInitiative.characterName
      && (item.y === currChar.y && ([-1, 1].indexOf(item.x - currChar.x) !== -1)
        || (item.x === currChar.x && ([-1, 1].indexOf(item.y - currChar.y) !== -1)));
  }

  askTrade(item: CharacterLayerGridsterItem) {
    const currChar = this.characterItems.find(char => char.character.name === this.currentInitiative.characterName);
    this.adventureService.askTrade(this.adventureId, {from: currChar.character.id, to: item.character.id});
  }

  canSwitchEquipment(item: CharacterLayerGridsterItem): boolean {
    return item.character.name === this.currentInitiative.characterName;
  }

  askSwitch(item: CharacterLayerGridsterItem) {
    this.adventureService.askSwitch(this.adventureId, item.character.id);
  }
}
