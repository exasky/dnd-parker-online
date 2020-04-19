import {Component, Input, ViewChild} from "@angular/core";
import {MatMenuTrigger} from "@angular/material/menu";
import {LayerGridsterItem} from "../../../model/layer-gridster-item";
import {LayerElement, LayerElementType} from "../../../model/adventure";
import {AuthService} from "../../../../login/auth.service";
import {GridsterItem} from "angular-gridster2";
import {AdventureService} from "../../../service/adventure.service";
import {GmService} from "../../../service/gm.service";
import {AdventureComponent} from "../adventure.component";
import {DialogUtils} from "../../../../common/dialog/dialog.utils";
import {MatDialog} from "@angular/material/dialog";
import {SelectCardDialogComponent} from "./select-card-dialog.component";
import {CharacterItem} from "../../../model/character";

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

  LayerElementType = LayerElementType;

  contextMenuPosition = {x: '0px', y: '0px'};

  constructor(public authService: AuthService,
              private adventureService: AdventureService,
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
    return type.startsWith('TRAP_') || type.indexOf('_DOOR_') !== -1;
  }

  flipElement(item: LayerGridsterItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    let nextLayerElement: LayerElement;
    switch (item.type) {
      case LayerElementType.TRAP_DEACTIVATED:
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.TRAP_ACTIVATED);
        break;
      case LayerElementType.TRAP_ACTIVATED:
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.TRAP_DEACTIVATED);
        break;
      case LayerElementType.VERTICAL_DOOR_HORIZONTAL_CLOSED:
        this.gmService.playSound(this.adventureId, 'door_open_0.mp3');
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_HORIZONTAL_OPENED);
        break;
      case LayerElementType.VERTICAL_DOOR_HORIZONTAL_OPENED:
        this.gmService.playSound(this.adventureId, 'door_close_0.mp3');
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_HORIZONTAL_CLOSED);
        break;
      case LayerElementType.VERTICAL_DOOR_VERTICAL_CLOSED:
        this.gmService.playSound(this.adventureId, 'door_open_1.mp3');
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_VERTICAL_OPENED);
        break;
      case LayerElementType.VERTICAL_DOOR_VERTICAL_OPENED:
        this.gmService.playSound(this.adventureId, 'door_close_0.mp3');
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_VERTICAL_CLOSED);
        break;
    }

    if (nextLayerElement) {
      item.type = nextLayerElement.type;
      item.elementId = nextLayerElement.id;
      item.icon = nextLayerElement.icon;

      this.adventureService.updateLayerItem(this.adventureId, AdventureComponent.gridsterItemToLayerItem(item));
    }
  }

  showTrap(item: GridsterItem) {
    this.adventureService.showTrap(this.adventureId, item.id);
  }

  openChest(item: LayerGridsterItem) {
    if (item.cardId !== undefined) {
      this.adventureService.drawSpecificCard(this.adventureId, item.cardId);
      this.adventureService.deleteLayerItem(this.adventureId, item.id);
    } else {
      this.adventureService.drawCard(this.adventureId);
      this.adventureService.deleteLayerItem(this.adventureId, item.id);
    }
  }

  deleteItem(item: GridsterItem) {
    this.adventureService.deleteLayerItem(this.adventureId, item.id);
  }

  setChestCard(item: LayerGridsterItem) {
    this.dialog.open(SelectCardDialogComponent, DialogUtils.getDefaultConfig(item['cardId']))
      .afterClosed().subscribe((value: CharacterItem) => {
      this.adventureService.setChestSpecificCard(this.adventureId, {
        characterItemId: value.id,
        layerItemId: item.id
      });
    });
  }
}
