import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import {
  CharacterLayerGridsterItem,
  ChestLayerGridsterItem,
  DoorLayerGridsterItem,
  LayerGridsterItem,
  MonsterLayerGridsterItem,
  TrapLayerGridsterItem,
} from "../../../model/layer-gridster-item";
import { GM_CHAR_NAME, Initiative, LayerElement, LayerElementType } from "../../../model/adventure";
import { AuthService } from "../../../../login/auth.service";
import { AdventureService } from "../../../service/adventure.service";
import { GmService } from "../../../service/gm.service";
import { DialogUtils } from "../../../../common/dialog/dialog.utils";
import { MatDialog } from "@angular/material/dialog";
import { SelectCardDialogComponent } from "./dialog/select-card-dialog.component";
import { AdventureCardService } from "../../../service/adventure-card.service";
import { AdventureUtils } from "../utils/utils";
import { CharacterEquipment } from "../../../model/character";
import { DiceService } from "../../../service/dice.service";
import { SelectWeaponDialogComponent } from "./dialog/select-weapon-dialog.component";
import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-context-menu",
  templateUrl: "./context-menu.component.html",
  imports: [MatMenuModule, TranslateModule, MatIconModule, MatDividerModule, CommonModule],
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
  selectedItem: LayerGridsterItem;

  @Input()
  selectedMonsterId: number;

  LayerElementType = LayerElementType;

  contextMenuPosition = { x: "0px", y: "0px" };

  isCharacterMove = false;

  @Output()
  startCharacterMove: EventEmitter<CharacterLayerGridsterItem> = new EventEmitter<CharacterLayerGridsterItem>();

  @Output()
  resetCharacterMove: EventEmitter<CharacterLayerGridsterItem> = new EventEmitter<CharacterLayerGridsterItem>();

  @Output()
  validateCharacterMove: EventEmitter<CharacterLayerGridsterItem> = new EventEmitter<CharacterLayerGridsterItem>();

  @Output()
  closeMenu: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private adventureService: AdventureService,
    private adventureCardService: AdventureCardService,
    private gmService: GmService,
    private diceService: DiceService,
    private dialog: MatDialog,
  ) {}

  openMenu(event: MouseEvent, item: LayerGridsterItem) {
    if (this.isContextMenuEnabled(item)) {
      event.preventDefault();
      this.contextMenuPosition.x = event.clientX + "px";
      this.contextMenuPosition.y = event.clientY + "px";
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    }
  }

  private isContextMenuEnabled(item: LayerGridsterItem) {
    if (this.authService.isGM()) return true;
    if (!this.currentInitiative && !this.selectedItem) return false;
    if (!AdventureUtils.isMyTurn(this.authService.currentUserValue(), this.currentInitiative)) return false;
    if (ContextMenuComponent.interactiveItemsForPlayer().indexOf(item.type) === -1) return false;
    // noinspection RedundantIfStatementJS
    if (ContextMenuComponent.flippableItems().indexOf(item.type) !== -1 && !this.isItemFlippable(item)) return false;

    return true;
  }

  private static interactiveItemsForPlayer(): LayerElementType[] {
    return [LayerElementType.DOOR, LayerElementType.CHARACTER, LayerElementType.CHEST, LayerElementType.MONSTER];
  }

  isItemFlippable(item: LayerGridsterItem) {
    return (
      ContextMenuComponent.flippableItems().indexOf(item.type) !== -1 &&
      (this.authService.isGM() ||
        (AdventureUtils.areItemsNextToEachOther(item, this.getCurrentCharacterTurn()) &&
          item.type === LayerElementType.DOOR))
    );
  }

  private static flippableItems(): LayerElementType[] {
    return [LayerElementType.TRAP, LayerElementType.DOOR];
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
        this.gmService.playSound(this.adventureId, "door_" + (doorGridsterItem.open ? "open" : "close") + "_0.mp3");
        break;
    }

    this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  showTrap(item: TrapLayerGridsterItem) {
    item.shown = true;
    this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  canOpenChest(item: ChestLayerGridsterItem) {
    return this.authService.isGM() || AdventureUtils.areItemsNextToEachOther(item, this.getCurrentCharacterTurn());
  }

  openChest(item: ChestLayerGridsterItem) {
    const currCharItem = this.characterItems.find(
      (char) => char.character.name === this.getCurrentInitiative().characterName,
    );
    if (item.specificCard) {
      this.adventureCardService.drawCard(this.adventureId, currCharItem.character.id, item.id, item.specificCard.id);
    } else if (currCharItem) {
      this.adventureCardService.drawCard(this.adventureId, currCharItem.character.id, item.id);
    }
  }

  deleteItem(item: LayerGridsterItem) {
    this.adventureService.deleteLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
  }

  setChestCard(item: ChestLayerGridsterItem) {
    this.dialog
      .open(SelectCardDialogComponent, DialogUtils.getDefaultConfig(item["cardId"]))
      .afterClosed()
      .subscribe((value: CharacterEquipment) => {
        item.specificCard = value;
        this.adventureService.updateLayerItem(this.adventureId, AdventureUtils.existingGridsterItemToLayerItem(item));
      });
  }

  canMove(item: CharacterLayerGridsterItem) {
    return !this.authService.isGM() && !this.isCharacterMove && this.isItemMe(item);
  }

  startMove(item: CharacterLayerGridsterItem) {
    this.isCharacterMove = true;
    this.startCharacterMove.emit(item);
  }

  resetMove(item: CharacterLayerGridsterItem) {
    this.resetCharacterMove.emit(item);
  }

  validateMove(item: CharacterLayerGridsterItem) {
    this.isCharacterMove = false;
    this.validateCharacterMove.emit(item);
  }

  attackMonster(item: MonsterLayerGridsterItem) {
    if (Initiative.isGmTurn(this.getCurrentInitiative())) {
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, item.id, true, true);
    } else {
      this.dialog
        .open(
          SelectWeaponDialogComponent,
          DialogUtils.getDefaultConfig({ character: this.getCurrentCharacterTurn().character }),
        )
        .afterClosed()
        .subscribe((value: CharacterEquipment) => {
          if (!value) return;
          this.diceService.openDiceAttackDialog(
            this.adventureId,
            this.getCurrentCharacterTurn().character.id,
            item.id,
            false,
            true,
            value.id,
          );
        });
    }
  }

  attackCharacter(item: CharacterLayerGridsterItem) {
    if (Initiative.isGmTurn(this.getCurrentInitiative())) {
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, item.id, true, false);
    } else {
      this.dialog
        .open(
          SelectWeaponDialogComponent,
          DialogUtils.getDefaultConfig({ character: this.getCurrentCharacterTurn().character }),
        )
        .afterClosed()
        .subscribe((value: CharacterEquipment) => {
          if (!value) return;
          this.diceService.openDiceAttackDialog(
            this.adventureId,
            this.getCurrentCharacterTurn().character.id,
            item.id,
            false,
            false,
            value.id,
          );
        });
    }
  }

  canTradeWith(item: CharacterLayerGridsterItem): boolean {
    if (this.getCurrentCharacterTurn()) {
      return !this.isItemMe(item) && AdventureUtils.areItemsNextToEachOther(item, this.getCurrentCharacterTurn());
    } else {
      return false;
    }
  }

  askTrade(item: CharacterLayerGridsterItem) {
    this.adventureService.askTrade(this.adventureId, {
      from: this.getCurrentCharacterTurn().character.id,
      to: item.character.id,
    });
  }

  canSwitchEquipment(item: CharacterLayerGridsterItem): boolean {
    return this.isItemMe(item);
  }

  askSwitch(item: CharacterLayerGridsterItem) {
    this.adventureService.askSwitch(this.adventureId, item.character.id);
  }

  private getCurrentCharacterTurn(): CharacterLayerGridsterItem {
    return this.characterItems.find((char) => char.character.name === this.getCurrentInitiative().characterName);
  }

  private isItemMe(item: CharacterLayerGridsterItem): boolean {
    return item.character.name === this.getCurrentInitiative().characterName;
  }

  private getCurrentInitiative(): Initiative {
    if (!this.currentInitiative) {
      let characterName = "";
      if (this.selectedItem) {
        if (this.selectedItem.type === LayerElementType.CHARACTER) {
          characterName = (this.selectedItem as CharacterLayerGridsterItem).character.name;
        } else if (this.selectedItem.type === LayerElementType.MONSTER) {
          characterName = GM_CHAR_NAME;
        }
      }
      return {
        characterName,
        number: 0,
      };
    }
    return this.currentInitiative;
  }
}
