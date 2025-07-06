import { Component, computed, EventEmitter, Input, output, Output, signal, ViewChild } from "@angular/core";
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

  startCharacterMove = output<CharacterLayerGridsterItem>();
  resetCharacterMove = output<CharacterLayerGridsterItem>();
  validateCharacterMove = output<CharacterLayerGridsterItem>();
  closeMenu = output<void>();

  constructor(
    public authService: AuthService,
    private adventureService: AdventureService,
    private adventureCardService: AdventureCardService,
    private gmService: GmService,
    private diceService: DiceService,
    private dialog: MatDialog,
  ) {}

  menuItem = signal<LayerGridsterItem>(null);

  openMenu(event: MouseEvent, item: LayerGridsterItem) {
    this.menuItem.set(item);
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
    if (!this.isItemFlippable()) return false;

    return true;
  }

  private static interactiveItemsForPlayer(): LayerElementType[] {
    return [LayerElementType.DOOR, LayerElementType.CHARACTER, LayerElementType.CHEST, LayerElementType.MONSTER];
  }

  isItemFlippable = computed(() => {
    return (
      ContextMenuComponent.flippableItems().indexOf(this.menuItem().type) !== -1 &&
      (this.authService.isGM() ||
        (AdventureUtils.areItemsNextToEachOther(this.menuItem(), this.getCurrentCharacterTurn()) &&
          this.menuItem().type === LayerElementType.DOOR))
    );
  });

  private static flippableItems(): LayerElementType[] {
    return [LayerElementType.TRAP, LayerElementType.DOOR];
  }

  flipElement(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    switch (this.menuItem().type) {
      case LayerElementType.TRAP:
        this.menuItem.update((m) => {
          return { ...m, shown: false, deactivated: !m["deactivated"] };
        });
        break;
      case LayerElementType.DOOR:
        this.menuItem.update((m) => {
          return { ...m, open: !m["open"] };
        });
        this.gmService.playSound(this.adventureId, "door_" + (this.menuItem()["open"] ? "open" : "close") + "_0.mp3");
        break;
    }

    this.adventureService.updateLayerItem(
      this.adventureId,
      AdventureUtils.existingGridsterItemToLayerItem(this.menuItem()),
    );
  }

  canShowTrap = computed(() => this.authService.isGM() && !this.menuItem()["shown"] && !this.menuItem()["deactivated"]);
  showTrap() {
    this.menuItem.update((v) => {
      return { ...v, shown: true };
    });
    this.adventureService.updateLayerItem(
      this.adventureId,
      AdventureUtils.existingGridsterItemToLayerItem(this.menuItem()),
    );
  }

  canOpenChest = computed(
    () =>
      this.authService.isGM() ||
      AdventureUtils.areItemsNextToEachOther(this.menuItem(), this.getCurrentCharacterTurn()),
  );
  openChest() {
    const currCharItem = this.characterItems.find(
      (char) => char.character.name === this.getCurrentInitiative().characterName,
    );
    if (this.menuItem()["specificCard"]) {
      this.adventureCardService.drawCard(
        this.adventureId,
        currCharItem.character.id,
        this.menuItem().id,
        this.menuItem()["specificCard"].id,
      );
    } else if (currCharItem) {
      this.adventureCardService.drawCard(this.adventureId, currCharItem.character.id, this.menuItem().id);
    }
  }

  deleteItem() {
    this.adventureService.deleteLayerItem(
      this.adventureId,
      AdventureUtils.existingGridsterItemToLayerItem(this.menuItem()),
    );
  }

  setChestCard() {
    this.dialog
      .open(SelectCardDialogComponent, DialogUtils.getDefaultConfig(this.menuItem()["cardId"]))
      .afterClosed()
      .subscribe((value: CharacterEquipment) => {
        this.menuItem.update((v) => {
          return { ...v, specificCard: value };
        });
        this.adventureService.updateLayerItem(
          this.adventureId,
          AdventureUtils.existingGridsterItemToLayerItem(this.menuItem()),
        );
      });
  }

  canMove = computed(() => {
    return (
      !this.authService.isGM() && !this.isCharacterMove && this.isItemMe(this.menuItem() as CharacterLayerGridsterItem)
    );
  });
  startMove() {
    this.isCharacterMove = true;
    this.startCharacterMove.emit(this.menuItem() as CharacterLayerGridsterItem);
  }

  resetMove() {
    this.resetCharacterMove.emit(this.menuItem() as CharacterLayerGridsterItem);
  }

  validateMove() {
    this.isCharacterMove = false;
    this.validateCharacterMove.emit(this.menuItem() as CharacterLayerGridsterItem);
  }

  attackMonster() {
    if (Initiative.isGmTurn(this.getCurrentInitiative())) {
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, this.menuItem().id, true, true);
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
            this.menuItem().id,
            false,
            true,
            value.id,
          );
        });
    }
  }

  attackCharacter() {
    if (Initiative.isGmTurn(this.getCurrentInitiative())) {
      this.diceService.openDiceAttackDialog(this.adventureId, this.selectedMonsterId, this.menuItem().id, true, false);
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
            this.menuItem().id,
            false,
            false,
            value.id,
          );
        });
    }
  }

  canTradeWith = computed(() => {
    if (this.getCurrentCharacterTurn()) {
      return (
        !this.isItemMe(this.menuItem() as CharacterLayerGridsterItem) &&
        AdventureUtils.areItemsNextToEachOther(this.menuItem(), this.getCurrentCharacterTurn())
      );
    } else {
      return false;
    }
  });

  askTrade() {
    this.adventureService.askTrade(this.adventureId, {
      from: this.getCurrentCharacterTurn().character.id,
      to: (this.menuItem() as CharacterLayerGridsterItem).character.id,
    });
  }

  canSwitchEquipment = computed(() => this.isItemMe(this.menuItem() as CharacterLayerGridsterItem));

  askSwitch() {
    this.adventureService.askSwitch(this.adventureId, (this.menuItem() as CharacterLayerGridsterItem).character.id);
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
