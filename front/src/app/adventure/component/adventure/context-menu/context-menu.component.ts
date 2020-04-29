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
    if (this.isContextMenuEnabled()) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = {'item': item};
      this.contextMenu.menu.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    }
  }

  private isContextMenuEnabled() {
    return this.authService.isGM || AdventureUtils.isMyTurn(this.authService.currentUserValue, this.currentInitiative);
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

  canOpenChest(item: ChestLayerGridsterItem) {
    return this.authService.isGM || AdventureUtils.areItemsNextToEachOther(item, this.getCurrentCharacterTurn());
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
    if (Initiative.isGm(this.currentInitiative)) {
      console.log('GM cannot attack monster yet...')
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, item.id, true, true);
    } else {
      this.diceService.openDiceAttackDialog(this.adventureId, this.getCurrentCharacterTurn().character.id, item.id, false, true);
    }
  }

  attackCharacter(item: CharacterLayerGridsterItem) {
    if (Initiative.isGm(this.currentInitiative)) {
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, item.id, true, false);
    } else {
      this.diceService.openDiceAttackDialog(this.adventureId, this.getCurrentCharacterTurn().character.id, item.id, false, false);
    }
  }

  canTradeWith(item: CharacterLayerGridsterItem): boolean {
    return item.character.name !== this.currentInitiative.characterName
      && AdventureUtils.areItemsNextToEachOther(item, this.getCurrentCharacterTurn());
  }

  askTrade(item: CharacterLayerGridsterItem) {
    this.adventureService.askTrade(this.adventureId, {from: this.getCurrentCharacterTurn().character.id, to: item.character.id});
  }

  canSwitchEquipment(item: CharacterLayerGridsterItem): boolean {
    return item.character.name === this.currentInitiative.characterName;
  }

  askSwitch(item: CharacterLayerGridsterItem) {
    this.adventureService.askSwitch(this.adventureId, item.character.id);
  }

  private getCurrentCharacterTurn(): CharacterLayerGridsterItem {
    return this.characterItems.find(char => char.character.name === this.currentInitiative.characterName);
  }
}
