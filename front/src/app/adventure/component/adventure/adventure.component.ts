import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {
  CompactType,
  DisplayGrid,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from "angular-gridster2";
import {
  Adventure,
  Board,
  ChestLayerItem,
  DoorLayerItem,
  LayerElement,
  LayerElementType,
  LayerItem, MonsterLayerItem,
  TrapLayerItem
} from "../../model/adventure";
import {AdventureService} from "../../service/adventure.service";
import {GmService} from "../../service/gm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../login/auth.service";
import {ROLE_GM} from "../../../user/user";
import {SocketResponse} from "../../../common/model";
import {Subscription} from "rxjs";
import {DrawnCardWebsocketService} from "../../../common/service/ws/drawn-card.websocket.service";
import {DrawnCardDialogComponent} from "./item/drawn-card-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AdventureMessage, AdventureMessageType, MouseMove} from "../../model/adventure-message";
import {SocketResponseType} from "../../../common/model/websocket.response";
import {ToasterService} from "../../../common/service/toaster.service";
import {DialogUtils} from "../../../common/dialog/dialog.utils";
import {DiceMessage, DiceMessageType} from "../../model/dice-message";
import {DiceDialogComponent} from "./dice/dice-dialog.component";
import {DiceWebsocketService} from "../../../common/service/ws/dice.websocket.service";
import {MatDrawer} from "@angular/material/sidenav";
import {AdventureWebsocketService} from "../../../common/service/ws/adventure.websocket.service";
import {MonsterTemplate} from "../../model/monster";
import {AlertMessage, AlertMessageType} from "../../model/alert-message";
import {
  ChestLayerGridsterItem,
  DoorLayerGridsterItem,
  LayerGridsterItem, MonsterLayerGridsterItem,
  TrapLayerGridsterItem
} from "../../model/layer-gridster-item";
import {AudioService} from "../../service/audio.service";
import {Character} from "../../model/character";
import {AdventureCardService} from "../../service/adventure-card.service";
import {CardMessage, CardMessageType} from "../../model/card-message";
import {AdventureUtils} from "./utils/utils";

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss']
})
export class AdventureComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @ViewChild('boardPanel', {read: ElementRef}) boardPanel: ElementRef;

  @ViewChild('actionPanelDrawer', {read: MatDrawer}) actionPanelDrawer: MatDrawer;

  @ViewChild('mainDrawerContainer', {read: ElementRef}) mainDrawerContainer: ElementRef;

  @ViewChild('gridster', {read: GridsterComponent}) gridster: GridsterComponent;

  private lastMouseMoveSend: number;
  private mouseMoveDelay = 33; // 30fps

  adventureWSObs: Subscription;
  drawnCardWSObs: Subscription;
  diceWSObs: Subscription;

  LayerElementType = LayerElementType; // Used to access LayerElementType in html

  adventure: Adventure;

  addableLayerElements: LayerElement[];
  monsterTemplates: MonsterTemplate[];

  options: GridsterConfig;
  dashboard: LayerGridsterItem[];

  gamePanelXSize = 0;
  gamePanelYSize = 0;

  showCursor: boolean = true;
  otherPlayersCursors: MouseMove[] = [];

  disableActions: boolean = false;

  selectedCharacterId: number;
  selectedMonsterId: number;

  selectedItem: LayerGridsterItem;
  // increased each time a player/monster move in order to keep the last moving item on top
  currentLayerIndexForSelectedItem = 1;

  currentDialog: MatDialogRef<any>;

  constructor(private adventureService: AdventureService,
              private adventureCardService: AdventureCardService,
              private gmService: GmService,
              public authService: AuthService,
              private toaster: ToasterService,
              private route: ActivatedRoute,
              private adventureWS: AdventureWebsocketService,
              private drawnCardWS: DrawnCardWebsocketService,
              private diceWS: DiceWebsocketService,
              private audioService: AudioService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.authService.isGM) {
      this.gmService.getAddableElements().subscribe(elements => this.addableLayerElements = elements);
      this.gmService.getMonsterTemplates().subscribe(monsters => this.monsterTemplates = monsters);
    }
    const adventureId = this.route.snapshot.paramMap.get("id");
    this.adventureService.getAdventure(adventureId).subscribe(adventure => {
      this.adventure = adventure;
      const currentUser = this.authService.currentUserValue;
      currentUser.currentCharacters = this.adventure.characters.filter(character => character.userId === currentUser.id);

      this.gamePanelYSize = this.adventure.boards.length;
      this.gamePanelXSize = this.adventure.boards.map((row: Board[]) => row.length).sort()[0];

      this.initGridsterConf();
      this.initDashboard();
    });

    this.adventureWSObs = this.adventureWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        switch (message.type) {
          case AdventureMessageType.GOTO:
            this.router.navigateByUrl('adventure/' + message.message).then(() => {
              window.location.reload();
            });
            break
          case AdventureMessageType.MOUSE_MOVE:
            const mouseMoveEvent: MouseMove = message.message;
            // Do not add own cursor
            if (mouseMoveEvent.userId !== this.authService.currentUserValue.id) {
              // Mouse out
              if (mouseMoveEvent.x === mouseMoveEvent.y && mouseMoveEvent.y === -1) {
                let playerCursorIxd = this.otherPlayersCursors.findIndex(pc => pc.userId === mouseMoveEvent.userId);
                if (playerCursorIxd !== -1) {
                  this.otherPlayersCursors.splice(playerCursorIxd, 1);
                }
                // Mouse move
              } else {
                mouseMoveEvent.x = mouseMoveEvent.x - mouseMoveEvent.offsetX;
                mouseMoveEvent.y = mouseMoveEvent.y - mouseMoveEvent.offsetY;
                let playerCursorIxd = this.otherPlayersCursors.findIndex(pc => pc.userId === mouseMoveEvent.userId);
                if (playerCursorIxd === -1) {
                  this.otherPlayersCursors.push(mouseMoveEvent);
                } else {
                  this.otherPlayersCursors[playerCursorIxd] = mouseMoveEvent;
                }
              }
            }
            break;
          case AdventureMessageType.UPDATE_CAMPAIGN:
            if (!message.message) {
              this.toaster.warning("Your GM has deleted all adventures for this campaign... Such an idiot");
              this.router.navigateByUrl('');
            } else if (this.adventure.id !== message.message.id) {
              this.router.navigateByUrl('adventure/' + message.message.id).then(() => {
                window.location.reload();
              });
            } else {
              this.adventure = message.message;
              this.adventure.otherItems
                .filter(layerItem => layerItem.element.type === LayerElementType.CHARACTER)
                .forEach(layerItem => this.updateItem(layerItem, 1));
            }
            break;
          case AdventureMessageType.UPDATE_CHARACTER:
            const character: Character = message.message;
            const toUpdate = this.adventure.characters.find(advChar => advChar.id === character.id);
            if (toUpdate) {
              toUpdate.maxHp = character.maxHp;
              toUpdate.hp = character.hp;
              toUpdate.maxMp = character.maxMp;
              toUpdate.mp = character.mp;
              toUpdate.equippedItems = character.equippedItems;
              toUpdate.backpackItems = character.backpackItems;
            }
            break;
          case AdventureMessageType.UPDATE_MONSTER:
            const monster: MonsterLayerItem = message.message;
            const monsterToUpdate = this.findInDashboard(monster) as MonsterLayerGridsterItem;
            if (monsterToUpdate) {
              monsterToUpdate.hp = monster.hp;
            }
            break;
          case AdventureMessageType.ADD_LAYER_ITEM:
            const newLayerItem = message.message;
            this.addItem(newLayerItem, this.getLayerIndex(newLayerItem.element));
            break;
          case AdventureMessageType.UPDATE_LAYER_ITEM:
            const updatedLayerItem = message.message;
            this.updateItem(updatedLayerItem, this.getLayerIndex(updatedLayerItem.element));
            break;
          case AdventureMessageType.REMOVE_LAYER_ITEM:
            const deletedLayerItem = message.message;
            this.removeItem(deletedLayerItem);
            break;
          case AdventureMessageType.SELECT_CHARACTER:
            this.selectedCharacterId = message.message;
            break;
          case AdventureMessageType.SELECT_MONSTER:
            this.selectedMonsterId = message.message;
            break;
          case AdventureMessageType.ALERT:
            const alert: AlertMessage = message.message;
            if (!alert.characterId || this.authService.currentUserValue.currentCharacters.some(char => char.id === alert.characterId)) {
              switch (alert.type) {
                case AlertMessageType.SUCCESS:
                  this.toaster.success(alert.message);
                  break;
                case AlertMessageType.WARN:
                  this.toaster.warning(alert.message);
                  break;
                case AlertMessageType.ERROR:
                  this.toaster.error(alert.message);
                  break;
              }
            }
            break;
          case AdventureMessageType.SOUND:
            const fileToPlay: string = message.message;
            this.audioService.playSound('/assets/sound/' + fileToPlay);
            break;
        }
      }
    });

    this.drawnCardWSObs = this.drawnCardWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: CardMessage = receivedMsg.data;
        switch (message.type) {
          case CardMessageType.DRAW_CARD:
            const drawerOpenedSaved = this.actionPanelDrawer.opened;
            this.disableActions = this.actionPanelDrawer.opened = true;
            this.currentDialog = this.dialog.open(DrawnCardDialogComponent,
              DialogUtils.getDefaultConfig({...message.message, characters: this.adventure.characters}));
            this.currentDialog.afterClosed().subscribe(() => {
              this.disableActions = false;
              this.actionPanelDrawer.opened = drawerOpenedSaved;
            });
            break;
          case CardMessageType.CLOSE_DIALOG:
            if (this.currentDialog) {
              this.currentDialog.close();
              this.currentDialog = null;
            }
            break
          default:
            break;
        }
      }
    })

    this.diceWSObs = this.diceWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
        switch (diceMessage.type) {
          case DiceMessageType.OPEN_DIALOG:
            const drawerOpenedSaved = this.actionPanelDrawer.opened;
            this.disableActions = this.actionPanelDrawer.opened = true;
            this.currentDialog = this.dialog.open(DiceDialogComponent, DialogUtils.getDefaultConfig({
              adventureId,
              user: receivedMsg.data.message
            }));
            this.currentDialog.afterClosed().subscribe(() => {
              this.disableActions = false;
              this.actionPanelDrawer.opened = drawerOpenedSaved;
            });
            break;
          case DiceMessageType.CLOSE_DIALOG:
            if (this.currentDialog) {
              this.currentDialog.close();
              this.currentDialog = null;
            }
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.adventureWSObs.unsubscribe();
    this.drawnCardWSObs.unsubscribe();
    this.diceWSObs.unsubscribe();
  }

  private initGridsterConf() {
    const rowSize = this.adventure.boards.length;
    const colSize = this.adventure.boards.map((row: Board[]) => row.length).sort()[0];

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: -1,
      outerMargin: true,
      outerMarginTop: 5,
      outerMarginRight: 5,
      outerMarginBottom: 5,
      outerMarginLeft: 5,
      useTransformPositioning: true,
      minCols: 11 * colSize,
      maxCols: 11 * colSize,
      minRows: 11 * rowSize,
      maxRows: 11 * rowSize,
      defaultItemCols: 1,
      defaultItemRows: 1,
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: true,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDropCallback: this.emptyCellDropCallback.bind(this),
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
        stop: this.stopItemDrag.bind(this)
      },
      swap: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      // displayGrid: DisplayGrid.Always,
      disableWindowResize: true,
      disableWarnings: false,
      scrollToNewItems: false,
      allowMultiLayer: true,
      itemChangeCallback: this.itemChange.bind(this),
    };
  }

  private initDashboard() {
    this.dashboard = [];
    this.adventure.traps.forEach(trap => this.updateItem(trap, 0));
    this.adventure.doors.forEach(door => this.updateItem(door, 0));
    this.adventure.chests.forEach(door => this.updateItem(door, 0));
    this.adventure.monsters.forEach(monster => this.updateItem(monster, this.getLayerIndex(monster.element)));
    this.adventure.otherItems.forEach(item => this.updateItem(item, this.getLayerIndex(item.element)));
  }

  stopItemDrag(item: LayerGridsterItem, itemComponent: GridsterItemComponentInterface) {
    if (item.x === itemComponent.$item.x && item.y === itemComponent.$item.y) { // Case click
      if (this.selectedItem && this.selectedItem.id === item.id) { // Click on case selected case
        this.selectedItem = null;
      } else {
        if (item.type === LayerElementType.MONSTER) {
          this.selectMonster(item.id);
        } else {
          this.selectedItem = item;
        }
        this.mainDrawerContainer.nativeElement.focus();
      }
    } else { // Case drag&drop
      this.selectedItem = null;
    }
  }

  onMouseMove(e: MouseEvent) {
    if (!this.showCursor) {
      return;
    }
    if (Date.now() - this.lastMouseMoveSend < this.mouseMoveDelay) {
      return;
    }
    this.lastMouseMoveSend = Date.now();
    const mouseMove = new MouseMove();
    mouseMove.x = e.pageX;
    mouseMove.y = e.pageY;
    mouseMove.offsetX = this.boardPanel.nativeElement.getBoundingClientRect().left;
    mouseMove.offsetY = this.boardPanel.nativeElement.getBoundingClientRect().top;
    mouseMove.userId = this.authService.currentUserValue.id;
    mouseMove.username = this.authService.currentUserValue.username;
    this.adventureService.playerMouseMove(this.adventure.id, mouseMove);
  }

  onMouseOut() {
    const mouseMove = new MouseMove();
    mouseMove.x = -1;
    mouseMove.y = -1;
    mouseMove.userId = this.authService.currentUserValue.id;
    this.adventureService.playerMouseMove(this.adventure.id, mouseMove);
  }

  /**
   * Move selected item with arrow keys
   * @param e keyboard event
   */
  onKeyboard(e: KeyboardEvent) {
    if (e.code === 'Escape') {
      this.selectedItem = null;
    } else if (this.selectedItem && ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].indexOf(e.code) !== -1) {
      e.preventDefault();
      e.stopPropagation();

      const parentPos = this.mainDrawerContainer.nativeElement.getBoundingClientRect();
      const childPos = this.gridster.el.getElementsByClassName('selected')[0].getBoundingClientRect();
      const relativePos: any = {};

      relativePos.top = childPos.top - parentPos.top;
      relativePos.right = childPos.right - parentPos.right;
      relativePos.bottom = childPos.bottom - parentPos.bottom;
      relativePos.left = childPos.left - parentPos.left;

      let layerItem = AdventureUtils.existingGridsterItemToLayerItem(this.selectedItem);
      switch (e.code) {
        case "ArrowLeft":
          relativePos.left -= childPos.width; // position left prediction
          if (layerItem.positionX > 0) {
            layerItem.positionX -= 1;
            this.adventureService.updateLayerItem(this.adventure.id, layerItem);
          }
          break;
        case "ArrowUp":
          relativePos.top -= childPos.height; // position top prediction
          if (layerItem.positionY > 0) {
            layerItem.positionY -= 1;
            this.adventureService.updateLayerItem(this.adventure.id, layerItem);
          }
          break
        case "ArrowRight":
          relativePos.right += childPos.width; // position right prediction
          if (layerItem.positionX < this.options.maxCols - 1) {
            layerItem.positionX += 1;
            this.adventureService.updateLayerItem(this.adventure.id, layerItem);
          }
          break
        case "ArrowDown":
          relativePos.bottom += childPos.height; // position down prediction
          if (layerItem.positionY < this.options.maxRows - 1) {
            layerItem.positionY += 1;
            this.adventureService.updateLayerItem(this.adventure.id, layerItem);
          }
          break
      }
      const drawerContent = this.mainDrawerContainer.nativeElement.getElementsByTagName('mat-drawer-content')[0];
      if (relativePos.top < 0) {
        drawerContent.scrollBy(0, relativePos.top);
      }
      if (relativePos.right > 0) {
        drawerContent.scrollBy(relativePos.right, 0);
      }
      if (relativePos.left < 0) {
        drawerContent.scrollBy(relativePos.left, 0);
      }
      if (relativePos.bottom > 0) {
        drawerContent.scrollBy(0, relativePos.bottom);
      }
    }
  }

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  // region Webservice calls to update item
  emptyCellDropCallback(event: MouseEvent, item: GridsterItem) {
    const layerElementId = +(event as any).dataTransfer.getData('text');
    const elementToAdd: LayerElement = this.addableLayerElements.find(le => le.id === layerElementId);
    if (elementToAdd) {
      let itemToPush = {
        ...item,
        elementId: elementToAdd.id,
        cols: elementToAdd.colSize,
        rows: elementToAdd.rowSize,
        layerIndex: this.getLayerIndex(elementToAdd),
        name: elementToAdd.name,
        type: elementToAdd.type
      };

      this.adventureService.addLayerItem(this.adventure.id, this.newGridsterItemToLayerItem(itemToPush));
    } else {
      console.log('Cannot find element with layerId: ' + layerElementId);
    }
  }

  itemChange(item: LayerGridsterItem, itemComponent: GridsterItemComponentInterface) {
    if (this.dashboard.indexOf(item) !== -1) {
      this.adventureService.updateLayerItem(this.adventure.id, AdventureUtils.existingGridsterItemToLayerItem(item));
    }
  }

  // endregion

  private getLayerIndex(element: LayerElement) {
    return ([LayerElementType.CHARACTER, LayerElementType.MONSTER, LayerElementType.PILLAR, LayerElementType.TREE]
      .indexOf(element.type) !== -1)
      ? this.currentLayerIndexForSelectedItem++
      : 0
  }

  // region Update items in gridster
  addItem(item: LayerItem, layerIndex = 0) {
    if (!item) return;
    const itemToPush = {
      id: item.id,
      x: item.positionX,
      y: item.positionY,
      layerIndex,
      elementId: item.element.id,
      rows: item.element.rowSize,
      cols: item.element.colSize,
      name: item.element.name,
      type: item.element.type,
      dragEnabled: this.isDragEnabledForItem(item)
    };
    this.addSpecificToDashboardItem(itemToPush, item);
    this.dashboard.push(itemToPush);

    if (this.selectedItem && this.selectedItem.id === itemToPush.id) {
      this.selectedItem = itemToPush;
    }
  }

  updateItem(item: LayerItem, layerIndex = 0) {
    if (!item) return;
    const dashboardItem = this.findInDashboard(item);
    if (!dashboardItem) {
      this.addItem(item, layerIndex);
    } else {
      this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
      this.addItem(item, layerIndex);
    }
  }

  selectMonster(layerItemId: number) {
    this.selectedItem = this.dashboard.find(item => item.id === layerItemId);
    this.selectedMonsterId = layerItemId;
    this.adventureService.selectMonster(this.adventure.id, layerItemId);
  }

  removeItem(item: LayerItem) {
    if (!item) return;
    const dashboardItem = this.findInDashboard(item);
    this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
  }

  // TODO create utils function (when CHARACTER will be part of layer element list)
  private addSpecificToDashboardItem(dashboardItem: GridsterItem, layerItem: LayerItem) {
    switch (layerItem.element.type) {
      case LayerElementType.CHARACTER:
        dashboardItem['character']
          = this.adventure.characters.find(char => layerItem.element.name.toLowerCase().indexOf(char.name.toLowerCase()) !== -1);
        break;
      case LayerElementType.DOOR:
        const doorItem: DoorLayerItem = layerItem as DoorLayerItem;
        const doorGridsterItem = dashboardItem as DoorLayerGridsterItem;
        doorGridsterItem.vertical = doorItem.vertical;
        doorGridsterItem.open = doorItem.open;
        break;
      case LayerElementType.TRAP:
        const trapItem: TrapLayerItem = layerItem as TrapLayerItem;
        const trapGridsterItem = dashboardItem as TrapLayerGridsterItem;
        trapGridsterItem.shown = trapItem.shown;
        trapGridsterItem.deactivated = trapItem.deactivated;
        break;
      case LayerElementType.CHEST:
        const chestItem = layerItem as ChestLayerItem;
        const chestGridsterItem = dashboardItem as ChestLayerGridsterItem;
        chestGridsterItem.specificCard = chestItem.specificCard;
        break;
      case LayerElementType.MONSTER:
        const monsterItem = layerItem as MonsterLayerItem;
        const monsterGridsterItem = dashboardItem as MonsterLayerGridsterItem;
        monsterGridsterItem.hp = monsterItem.hp;
        monsterGridsterItem.monster = monsterItem.monster;
        break;
      default:
        break;
    }
  }

  private isDragEnabledForItem(item: LayerItem): boolean {
    const user = this.authService.currentUserValue;

    return user.role === ROLE_GM || (
      item.element.type === LayerElementType.CHARACTER
      && user.currentCharacters.find(char => char.name.toLowerCase() === item.element.name.toLowerCase()) !== undefined
    )
  }

  // endregion

  getCharacterNamesFromId(userId) {
    const characters = this.adventure.characters.filter(char => char.userId === userId);
    return characters.length !== 0 ? characters : [{name: 'MJ', icon: ''}];
  }

  newGridsterItemToLayerItem(item: LayerGridsterItem): LayerItem {
    const baseLayerItem = AdventureUtils.baseGridsterItemToLayerItem(item);
    switch (baseLayerItem.element.type) {
      case LayerElementType.DOOR:
        (baseLayerItem as DoorLayerItem).open = false;
        (baseLayerItem as DoorLayerItem).vertical = item.name === 'simple-vertical';
        break;
      case LayerElementType.TRAP:
        (baseLayerItem as TrapLayerItem).deactivated = false;
        (baseLayerItem as TrapLayerItem).shown = false;
        break;
      case LayerElementType.MONSTER:
        (baseLayerItem as MonsterLayerItem).monster = this.monsterTemplates.find(mt => mt.element.id === item.elementId);
        (baseLayerItem as MonsterLayerItem).hp = (baseLayerItem as MonsterLayerItem).monster.maxHp;
        break;
      default:
        break;
    }
    return baseLayerItem
  }

  tooltipDisabled(itemType: LayerElementType): boolean {
    return [LayerElementType.CHARACTER, LayerElementType.MONSTER].indexOf(itemType) === -1;
  }

  private findInDashboard(item: LayerItem) {
    return this.dashboard.find(ditem => ditem.id === item.id && ditem.type === item.element.type);
  }

  get monsters(): MonsterLayerGridsterItem[] {
    return this.dashboard.filter(layerItem => layerItem.type === LayerElementType.MONSTER) as MonsterLayerGridsterItem[];
  }
}
