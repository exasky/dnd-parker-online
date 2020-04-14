import {Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface,
  GridType
} from "angular-gridster2";
import {Adventure, Board, LayerElement, LayerElementType, LayerItem} from "../../model/adventure";
import {AdventureService} from "../../service/adventure.service";
import {GmService} from "../../service/gm.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../login/auth.service";
import {ROLE_GM} from "../../../user/user";
import {SocketResponse} from "../../../common/model";
import {Subscription} from "rxjs";
import {DrawnCardWebsocketService} from "../../../common/service/ws/drawn-card.websocket.service";
import {DrawnCardDialogComponent} from "./item/drawn-card-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AdventureMessage, AdventureMessageType, MouseMove} from "../../model/adventure-message";
import {SocketResponseType} from "../../../common/model/websocket.response";
import {ToasterService} from "../../../common/service/toaster.service";
import {DialogUtils} from "../../../common/dialog/dialog.utils";
import {DiceMessage, DiceMessageType} from "../../model/dice-message";
import {DiceDialogComponent} from "./dice/dice-dialog.component";
import {DiceWebsocketService} from "../../../common/service/ws/dice.websocket.service";
import {MatDrawer} from "@angular/material/sidenav";
import {AdventureWebsocketService} from "../../../common/service/ws/adventure.websocket.service";
import {Monster} from "../../model/monster";

@Component({
  selector: 'app-board',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss']
})
export class AdventureComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";
  @ViewChild('boardPanel', {read: ElementRef}) boardPanel: ElementRef;

  @ViewChild('drawer', {read: MatDrawer}) drawer: MatDrawer;

  private lastMouseMoveSend: number;
  private mouseMoveDelay = 33; // 30fps

  adventureWSObs: Subscription;
  drawnCardWSObs: Subscription;
  diceWSObs: Subscription;

  layerElementType = LayerElementType;

  adventure: Adventure;

  addableLayerElements: LayerElement[];

  options: GridsterConfig;
  dashboard: GridsterItem[];

  gamePanelXSize = 0;
  gamePanelYSize = 0;

  otherPlayersCursors: MouseMove[] = [];

  disableActions: boolean = false;

  monsters: Monster[] = [];
  selectedMonsterLayerItemId: number;

  constructor(private adventureService: AdventureService,
              private mjService: GmService,
              public authService: AuthService,
              private toaster: ToasterService,
              private route: ActivatedRoute,
              private adventureWS: AdventureWebsocketService,
              private drawnCardWS: DrawnCardWebsocketService,
              private diceWS: DiceWebsocketService,
              private router: Router,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.authService.isGM) {
      this.mjService.getAddableElements().subscribe(elements => this.addableLayerElements = elements);
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

    this.adventureWSObs = this.adventureWS.getObservable(adventureId).subscribe({
      next: (receivedMsg: SocketResponse) => {
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
                  // Mouse mouve
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
            case AdventureMessageType.UPDATE_CHARACTERS:
              if (!message.message) {
                this.toaster.warning("Your GM has deleted all adventures for this campaign... Such an idiot");
                this.router.navigateByUrl('');
              } else if (this.adventure.id !== message.message.id) {
                this.router.navigateByUrl('adventure/' + message.message.id).then(() => {
                  window.location.reload();
                });
              } else {
                this.adventure = message.message;
                this.adventure.characterLayer.items
                  .filter(layerItem => layerItem.element.type === LayerElementType.CHARACTER)
                  .forEach(layerItem => this.updateItem(layerItem, 1));
              }
              break
            case AdventureMessageType.ADD_LAYER_ITEM:
              const newLayerItem = message.message;
              this.addItem(newLayerItem, AdventureComponent.getLayerIndex(newLayerItem));
              break;
            case AdventureMessageType.UPDATE_LAYER_ITEM:
              const updatedLayerItem = message.message;
              this.updateItem(updatedLayerItem, AdventureComponent.getLayerIndex(updatedLayerItem));
              break;
            case AdventureMessageType.REMOVE_LAYER_ITEM:
              const layerItemId = message.message;
              const itemToRemove = this.dashboard.find(dashboardItem => dashboardItem.id === layerItemId);
              this.removeItem(itemToRemove);
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });

    this.drawnCardWSObs = this.drawnCardWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const drawerOpenedSaved = this.drawer.opened;
        this.disableActions = this.drawer.opened = true;
        this.dialog.open(DrawnCardDialogComponent, DialogUtils.getDefaultConfig(receivedMsg.data))
          .beforeClosed().subscribe(() => {
          this.disableActions = false;
          this.drawer.opened = drawerOpenedSaved;
        });
      }
    })

    this.diceWSObs = this.diceWS.getObservable(adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
        if (diceMessage.type === DiceMessageType.OPEN_DIALOG) {
          const drawerOpenedSaved = this.drawer.opened;
          this.disableActions = this.drawer.opened = true;
          this.dialog.open(DiceDialogComponent, DialogUtils.getDefaultConfig({
            adventureId,
            user: receivedMsg.data.message
          }))
            .beforeClosed().subscribe(() => {
            this.disableActions = false;
            this.drawer.opened = drawerOpenedSaved;
          });
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
        enabled: true
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
    this.adventure.mjLayer.items.forEach(mjItem => {
      this.updateItem(mjItem, 0);
    });
    this.adventure.characterLayer.items.forEach(characterItem => {
      this.updateItem(characterItem, 1);
    })
  }

  onMouseMove(e: MouseEvent) {
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

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  // region grid update to call back
  emptyCellDropCallback(event: MouseEvent, item: GridsterItem) {
    const layerElementId = +(event as any).dataTransfer.getData('text');
    const elementToAdd = this.addableLayerElements.find(le => le.id === layerElementId);

    let itemToPush = {
      ...item,
      elementId: elementToAdd.id,
      cols: elementToAdd.colSize,
      rows: elementToAdd.rowSize,
      layerIndex: AdventureComponent.getLayerIndex(elementToAdd),
      icon: elementToAdd.icon,
      rotation: elementToAdd.rotation,
      type: elementToAdd.type
    };

    this.adventureService.addLayerItem(this.adventure.id, AdventureComponent.gristerItemToLayerItem(itemToPush));
  }

  itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    this.adventureService.updateLayerItem(this.adventure.id, AdventureComponent.gristerItemToLayerItem(item));
  }

  clickOnFlipIcon(item: GridsterItem, event: MouseEvent) {
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
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_HORIZONTAL_OPENED);
        break;
      case LayerElementType.VERTICAL_DOOR_HORIZONTAL_OPENED:
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_HORIZONTAL_CLOSED);
        break;
      case LayerElementType.VERTICAL_DOOR_VERTICAL_CLOSED:
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_VERTICAL_OPENED);
        break;
      case LayerElementType.VERTICAL_DOOR_VERTICAL_OPENED:
        nextLayerElement = this.addableLayerElements.find(ale => ale.type === LayerElementType.VERTICAL_DOOR_VERTICAL_CLOSED);
        break;
    }

    if (nextLayerElement) {
      item.type = nextLayerElement.type;
      item.elementId = nextLayerElement.id;
      item.icon = nextLayerElement.icon;
      this.adventureService.updateLayerItem(this.adventure.id, AdventureComponent.gristerItemToLayerItem(item));
    }
  }

  clickOnDeleteIcon(item: GridsterItem, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.adventureService.deleteLayerItem(this.adventure.id, item.id);
  }

  // endregion

  private static getLayerIndex(element: LayerElement) {
    return ([LayerElementType.CHARACTER, LayerElementType.MONSTER, LayerElementType.PYLON, LayerElementType.TREE]
      .indexOf(element.type) !== -1)
      ? 1
      : 0
  }

  // region Item
  addItem(item: LayerItem, layerIndex = 0) {
    const itemToPush = {
      id: item.id,
      x: item.positionX,
      y: item.positionY,
      layerIndex,
      elementId: item.element.id,
      rows: item.element.rowSize,
      cols: item.element.colSize,
      icon: item.element.icon,
      rotation: item.element.rotation,
      type: item.element.type,
      dragEnabled: this.isDragEnabledForItem(item)
    };
    this.addSpecificToDashboardItem(itemToPush, item.element);
    this.dashboard.push(itemToPush)
    if (itemToPush.type === LayerElementType.MONSTER) {
      if (!this.monsters.some(monster => monster.layerItemId === itemToPush.id)) {
        const monsterIdx = this.monsters.length !== 0 ? this.monsters[this.monsters.length - 1].index + 1 : 0;
        this.monsters.push({
          layerItemId: itemToPush.id,
          hp: 0,
          name: itemToPush.icon,
          index: monsterIdx
        })
      }
    }
  }

  updateItem(item: LayerItem, layerIndex = 0) {
    const dashboardItem = this.dashboard.find(dashboardItem => dashboardItem.id === item.id);
    if (!dashboardItem) {
      this.addItem(item, layerIndex);
    } else {
      this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
      this.addItem(item, layerIndex);
    }
  }

  removeItem(item: GridsterItem) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    if (item.type === LayerElementType.MONSTER) {
      this.monsters.splice(this.monsters.findIndex(monster => monster.layerItemId === item.id), 1);
    }
  }

  private addSpecificToDashboardItem(dashboardItem: GridsterItem, layerElement: LayerElement) {
    if (layerElement.type === LayerElementType.CHARACTER) {
      dashboardItem['character']
        = this.adventure.characters.find(char => layerElement.icon.toLowerCase().indexOf(char.name.toLowerCase()) !== -1);
    } else if (layerElement.type === LayerElementType.TRAP_ACTIVATED) {
      dashboardItem['hidden'] = true;
    } else if (layerElement.type === LayerElementType.TRAP_DEACTIVATED) {
      dashboardItem['hidden'] = false;
    }
  }

  private isDragEnabledForItem(item: LayerItem): boolean {
    const user = this.authService.currentUserValue;

    return user.role === ROLE_GM || (
      item.element.type === LayerElementType.CHARACTER
      && user.currentCharacters.find(char => char.name.toLowerCase() === item.element.icon.toLowerCase()) !== undefined
    )
  }

  isItemFlippable(type: LayerElementType) {
    return type.startsWith('TRAP_') || type.indexOf('_DOOR_') !== -1;
  }

  // endregion

  getCharacterNamesFromId(userId) {
    const characters = this.adventure.characters.filter(char => char.userId === userId);
    return characters.length !== 0 ? characters : [{name: 'MJ', icon: ''}];
  }

  private static gristerItemToLayerItem(item: GridsterItem): LayerItem {
    return {
      id: item.id,
      positionX: item.x,
      positionY: item.y,
      element: {
        id: item.elementId,
        colSize: item.cols,
        rowSize: item.rows,
        type: item.type,
        icon: item.icon,
        rotation: item.rotation
      }
    }
  }

}
