import {Component, Input, ViewChild} from "@angular/core";
import {MatMenuTrigger} from "@angular/material/menu";
import {DoorLayerGridsterItem, LayerGridsterItem, TrapLayerGridsterItem} from "../../../model/layer-gridster-item";
import {LayerElement, LayerElementType} from "../../../model/adventure";
import {AuthService} from "../../../../login/auth.service";
import {GridsterItem} from "angular-gridster2";
import {AdventureService} from "../../../service/adventure.service";
import {GmService} from "../../../service/gm.service";
import {AdventureComponent} from "../adventure.component";
import {DialogUtils} from "../../../../common/dialog/dialog.utils";
import {MatDialog} from "@angular/material/dialog";
import {SelectCardDialogComponent} from "./select-card-dialog.component";
import {Character, CharacterItem} from "../../../model/character";
import {AdventureCardService} from "../../../service/adventure-card.service";

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
  characters: Character[];

  LayerElementType = LayerElementType;

  contextMenuPosition = {x: '0px', y: '0px'};

  constructor(public authService: AuthService,
              private adventureService: AdventureService,
              private adventureCardService: AdventureCardService,
              private gmService: GmService,
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
    return this.authService.isGM || item.type === LayerElementType.CHEST;
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

    this.adventureService.updateLayerItem(this.adventureId, AdventureComponent.gridsterItemToLayerItem(item));
  }

  showTrap(item: TrapLayerGridsterItem) {
    item.shown = true;
    this.adventureService.updateLayerItem(this.adventureId, AdventureComponent.gridsterItemToLayerItem(item));
  }

  openChest(item: LayerGridsterItem) {
    if (item.cardId !== undefined) {
      this.adventureCardService.drawSpecificCard(this.adventureId, item.cardId);
      // this.adventureService.deleteLayerItem(this.adventureId, item.id);
      // TODO remove chest only if mj accepted
    } else {
      const currentCharacter = this.characters.find(char => char.userId === this.authService.currentUserValue.id);
      if (currentCharacter) {
        this.adventureCardService.drawCard(this.adventureId, currentCharacter.id);
        // this.adventureService.deleteLayerItem(this.adventureId, item.id);
        // TODO remove chest only if mj accepted
      }
    }
  }

  deleteItem(item: LayerGridsterItem) {
    this.adventureService.deleteLayerItem(this.adventureId, AdventureComponent.gridsterItemToLayerItem(item));
  }

  setChestCard(item: LayerGridsterItem) {
    this.dialog.open(SelectCardDialogComponent, DialogUtils.getDefaultConfig(item['cardId']))
      .afterClosed().subscribe((value: CharacterItem) => {
      this.adventureCardService.setChestSpecificCard(this.adventureId, {
        characterItemId: value.id,
        layerItemId: item.id
      });
    });
  }
}
