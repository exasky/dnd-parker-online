import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  NgZone,
  OnDestroy,
  OnInit,
  Type,
  ViewChild
} from "@angular/core";
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
  CharacterLayerItem,
  DoorLayerItem,
  Initiative,
  LayerElement,
  LayerElementType,
  LayerItem,
  MonsterLayerItem,
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
import {DiceAttackDialogComponent, DiceDialogComponent} from "./dice/dice-dialog.component";
import {DiceWebsocketService} from "../../../common/service/ws/dice.websocket.service";
import {MatDrawer} from "@angular/material/sidenav";
import {AdventureWebsocketService} from "../../../common/service/ws/adventure.websocket.service";
import {MonsterTemplate} from "../../model/monster";
import {AlertMessage, AlertMessageType} from "../../model/alert-message";
import {CharacterLayerGridsterItem, LayerGridsterItem, MonsterLayerGridsterItem} from "../../model/layer-gridster-item";
import {AmbientAudioService, AudioService} from "../../service/audio.service";
import {AdventureCardService} from "../../service/adventure-card.service";
import {CardMessage, CardMessageType} from "../../model/card-message";
import {AdventureUtils} from "./utils/utils";
import {InitiativeDialogComponent} from "./initiative/initiative-dialog.component";
import {NextTurnDialogComponent} from "./action/next-turn-dialog.component";
import {Character} from "../../model/character";
import {TradeDialogComponent} from "./context-menu/dialog/trade/trade-dialog.component";
import {SwitchEquipmentDialogComponent} from "./context-menu/dialog/switch-equipment-dialog.component";
import {CardUtils} from "../../../common/utils/card-utils";
import {CharacterItem} from "../../model/item";
import {ContextMenuComponent} from "./context-menu/context-menu.component";

@Component({
  selector: 'app-adventure',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdventureComponent implements OnInit, OnDestroy {

  // TODO Performance
  // create components pour each type of GridsterLayerItem with ChangeDetectionStrategy.OnPush
  // on ws receive: update the right element instead of all oh them
  // how to add element without updating others ?
  // @ViewChildren to have the list of items ?
  // One ViewChildren per type of components ?

  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @ViewChild('boardPanel', {read: ElementRef}) boardPanel: ElementRef;

  @ViewChild('leftPanelDrawer', {read: MatDrawer}) leftPanelDrawer: MatDrawer;
  @ViewChild('actionPanelDrawer', {read: MatDrawer}) actionPanelDrawer: MatDrawer;

  @ViewChild('mainDrawerContainer', {read: ElementRef}) mainDrawerContainer: ElementRef;

  @ViewChild('gridster', {read: GridsterComponent}) gridster: GridsterComponent;

  @ViewChild('contextMenu', {read: ContextMenuComponent}) contextMenu: ContextMenuComponent;

  getMonsterDescriptionImage = CardUtils.getMonsterDescriptionImage;

  private lastMouseMoveSend: number;
  //private mouseMoveDelay = 33; // 33ms -> 30fps
  private mouseMoveDelay = 100; // 100ms -> 10fps
  private isMoveSending: boolean = false;

  adventureWSObs: Subscription;
  drawnCardWSObs: Subscription;
  diceWSObs: Subscription;

  LayerElementType = LayerElementType; // Used to access LayerElementType in html

  adventure: Adventure;
  characterTurns: Initiative[];
  currentTurn: Initiative;

  addableLayerElements: LayerElement[];
  monsterTemplates: MonsterTemplate[];

  options: GridsterConfig;
  dashboard: LayerGridsterItem[];

  gamePanelXSize = 0;
  gamePanelYSize = 0;

  showCursor: boolean = true;

  selectedMonsterId: number;

  beforeMoveSelectedItem: CharacterLayerGridsterItem;
  selectedItem: LayerGridsterItem;
  // increased each time a player/monster move in order to keep the last moving item on top
  currentLayerIndexForSelectedItem = 1;

  currentDialog: MatDialogRef<any>;

  isLogPanel = true;

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
              private ambientService: AmbientAudioService,
              private router: Router,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              private ref: ElementRef) {
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
      currentUser.characters = this.adventure.campaignCharacters.filter(character => character.userId === currentUser.id);

      this.currentTurn = this.adventure.currentTurn;
      this.characterTurns = this.adventure.characterTurns;

      this.gamePanelYSize = this.adventure.boards.length;
      this.gamePanelXSize = this.adventure.boards.map((row: Board[]) => row.length).sort()[0];

      this.initGridsterConf();
      this.initDashboard();

      this.zone.runOutsideAngular(() => {
        this.boardPanel.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.boardPanel.nativeElement.addEventListener('mouseout', this.onMouseOut.bind(this));
        // TODO remove event listerner on destroy ?
      });
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
              this.adventure.characters.forEach(layerItem => this.updateItem(layerItem));
            }
            break;
          case AdventureMessageType.UPDATE_CHARACTER:
            const updatedCharacter = AdventureUtils.updateCharacter(message.message, this.characters.map(char => char.character));
            if (updatedCharacter) {
              const characterItem = this.characters.find(charItem => charItem.character.id === updatedCharacter.id);
              characterItem.dragEnabled = this.isDragEnabledForGridsterItem(characterItem);
              this.updateGridsterItem(characterItem);
              if (this.isSameItemAsSelected(characterItem)) {
                this.selectedItem = null;
              }
            }
            break;
          case AdventureMessageType.UPDATE_MONSTER:
            const monster: MonsterLayerItem = message.message;
            const monsterToUpdate = this.findInDashboard(monster) as MonsterLayerGridsterItem;
            if (monsterToUpdate) {
              monsterToUpdate.hp = monster.hp;
            }
            break;
          case AdventureMessageType.ROLL_INITIATIVE:
            const charTurns: Initiative[] = message.message;
            this.characterTurns = charTurns;
            if (!this.characterTurns || this.characterTurns.length === 0) { // Reset initiative
              this.currentTurn = null;
            } else {
              this.currentTurn = this.characterTurns[0];
              this.openDialog(InitiativeDialogComponent, {adventureId: this.adventure.id, initiatives: charTurns});
            }
            this.characters.forEach(char => {
              char.dragEnabled = this.isDragEnabledForGridsterItem(char);
              this.updateGridsterItem(char);
            })
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.ADD_LAYER_ITEM:
            this.addItem(message.message);
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.UPDATE_LAYER_ITEM:
            this.updateItem(message.message);
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.REMOVE_LAYER_ITEM:
            this.removeItem(message.message);
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.SELECT_MONSTER:
            this.selectedMonsterId = message.message;
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.ALERT:
            const alert: AlertMessage = message.message;
            if (!alert.characterId || this.authService.currentUserValue.characters.some(char => char.id === alert.characterId)) {
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
            this.audioService.playSound('/assets/sound/' + message.message);
            break;
          case AdventureMessageType.AMBIENT_SOUND:
            this.ambientService.playSound('/assets/sound/ambient/' + message.message);
            break;
          case AdventureMessageType.CLOSE_DIALOG:
            this.closeDialog();
            break;
          case AdventureMessageType.ASK_NEXT_TURN:
            this.openDialog(NextTurnDialogComponent, {adventureId: this.adventure.id, currentTurn: this.currentTurn});
            break;
          case AdventureMessageType.VALIDATE_NEXT_TURN:
            if (this.beforeMoveSelectedItem) {
              this.contextMenu.validateMove(this.selectedItem as CharacterLayerGridsterItem);
            }

            const dashboardCharacters = this.dashboard.filter(item => item.type === LayerElementType.CHARACTER);

            let prevCharacterTurn: LayerGridsterItem;
            if (this.currentTurn) {
              prevCharacterTurn = dashboardCharacters.find(char => char.name === this.currentTurn.characterName);
            }

            this.currentTurn = message.message;

            if (prevCharacterTurn) {
              if (this.isSameItemAsSelected(prevCharacterTurn)) {
                this.selectedItem = null;
              }
              prevCharacterTurn.dragEnabled = this.isDragEnabledForGridsterItem(prevCharacterTurn);
              this.updateGridsterItem(prevCharacterTurn);
            }

            const nextCharacterTurn = dashboardCharacters.find(char => char.name === this.currentTurn.characterName);
            if (nextCharacterTurn) {
              nextCharacterTurn.dragEnabled = this.isDragEnabledForGridsterItem(nextCharacterTurn);
              this.updateGridsterItem(nextCharacterTurn);
            }

            this.closeDialog();
            this.cdr.detectChanges();
            break;
          case AdventureMessageType.ASK_TRADE:
            const trade = message.message;
            const from = this.characters.find(char => char.character.id === trade.from).character;
            const to = this.characters.find(char => char.character.id === trade.to).character;
            this.currentDialog = this.dialog.open(TradeDialogComponent, DialogUtils.getDefaultConfig({
              adventureId: this.adventure.id,
              trade: {from, to}
            }));
            break;
          case AdventureMessageType.ASK_SWITCH:
            const character = this.characters.find(char => char.character.id === message.message).character;
            this.currentDialog = this.dialog.open(SwitchEquipmentDialogComponent, DialogUtils.getDefaultConfig({
              adventureId: this.adventure.id,
              character
            }));
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
            this.actionPanelDrawer.opened = true;
            this.openDialog(DrawnCardDialogComponent, {
              ...message.message,
              characters: this.characters.map(char => char.character),
              currentInitiative: this.currentTurn
            }).afterClosed().subscribe(() => {
              this.actionPanelDrawer.opened = drawerOpenedSaved;
            });
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
            this.actionPanelDrawer.opened = true;
            this.openDialog(DiceDialogComponent, {adventureId, user: receivedMsg.data.message})
              .afterClosed().subscribe(() => {
              this.actionPanelDrawer.opened = drawerOpenedSaved;
            });
            break;
          case DiceMessageType.OPEN_ATTACK_DIALOG:
            const saveDrawerOpen = this.actionPanelDrawer.opened;
            this.actionPanelDrawer.opened = true;

            const attackParameters = diceMessage.message;
            let fromAttack, toAttack, fromAttackWeapon;

            fromAttack = attackParameters.isMonsterAttack
              ? this.monsters.find(monster => monster.id === attackParameters.fromAttackId)
              : this.characters.find(character => character.character.id === attackParameters.fromAttackId);

            if (attackParameters.isMonsterAttacked) {
              toAttack = this.monsters.find(monster => monster.id === attackParameters.toAttackId);
              this.selectedMonsterId = toAttack.id;
            } else {
              toAttack = this.characters.find(character => character.id === attackParameters.toAttackId);
            }

            if (!attackParameters.isMonsterAttack && attackParameters.fromAttackWeaponId) {
              fromAttackWeapon = (fromAttack as CharacterItem).character.equippedItems
                .find(equipped => equipped.id === attackParameters.fromAttackWeaponId);
            }

            this.openDialog(DiceAttackDialogComponent, {
              adventureId,
              user: attackParameters.user,
              fromAttack,
              toAttack,
              fromAttackWeapon
            }).afterClosed().subscribe(() => {
              this.actionPanelDrawer.opened = saveDrawerOpen;
            });
            break;
          case DiceMessageType.CLOSE_DIALOG:
            this.closeDialog();
            break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.adventureWSObs.unsubscribe();
    this.drawnCardWSObs.unsubscribe();
    this.diceWSObs.unsubscribe();
    this.closeDialog();
  }

  get monsters(): MonsterLayerGridsterItem[] {
    return this.dashboard.filter(layerItem => layerItem.type === LayerElementType.MONSTER) as MonsterLayerGridsterItem[];
  }

  get characters(): CharacterLayerGridsterItem[] {
    return this.dashboard.filter(layerItem => layerItem.type === LayerElementType.CHARACTER) as CharacterLayerGridsterItem[];
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
    this.adventure.traps.forEach(trap => this.updateItem(trap));
    this.adventure.doors.forEach(door => this.updateItem(door));
    this.adventure.chests.forEach(door => this.updateItem(door));
    this.adventure.monsters.forEach(monster => this.updateItem(monster));
    this.adventure.characters.forEach(character => this.updateItem(character));
    this.adventure.otherItems.forEach(item => this.updateItem(item));
    this.cdr.detectChanges();
  }

  toggleLogPanel() {
    if (this.isLogPanel && this.leftPanelDrawer.opened) {
      this.leftPanelDrawer.close();
    } else if (!this.leftPanelDrawer.opened) {
      this.leftPanelDrawer.open();
    }
    this.isLogPanel = true;
  }

  toggleGmPanel() {
    if (this.authService.isGM) {
      if (!this.isLogPanel && this.leftPanelDrawer.opened) {
        this.leftPanelDrawer.close();
      } else if (!this.leftPanelDrawer.opened) {
        this.leftPanelDrawer.open();
      }
      this.isLogPanel = false;
    }
  }

  stopItemDrag(item: LayerGridsterItem, itemComponent: GridsterItemComponentInterface) {
    this.focusMainDrawer()

    if (!this.authService.isGM && this.currentTurn) return;

    if (item.x === itemComponent.$item.x && item.y === itemComponent.$item.y) { // Case click
      if (this.isSameItemAsSelected(item)) { // Click on case selected case
        this.selectedItem = null;
      } else {
        if (item.type === LayerElementType.MONSTER) {
          this.selectMonster(item.id);
        } else {
          this.selectedItem = item;
        }
      }
    }
  }

  startCharacterMove(item: CharacterLayerGridsterItem) {
    this.beforeMoveSelectedItem = JSON.parse(JSON.stringify(item));
    this.beforeMoveSelectedItem.dragEnabled = false;
    this.beforeMoveSelectedItem.id = null;
    this.beforeMoveSelectedItem.layerIndex--;

    this.selectedItem = item;

    this.dashboard.push(this.beforeMoveSelectedItem);
    this.focusMainDrawer()
  }

  resetCharacterMove() {
    this.selectedItem.x = this.beforeMoveSelectedItem.x;
    this.selectedItem.y = this.beforeMoveSelectedItem.y;

    this.adventureService.updateLayerItem(this.adventure.id, AdventureUtils.existingGridsterItemToLayerItem(this.selectedItem));
    this.focusMainDrawer()
  }

  validateCharacterMove() {
    this.dashboard.splice(this.dashboard.indexOf(this.beforeMoveSelectedItem), 1);
    this.beforeMoveSelectedItem = null;
    if (this.currentTurn) this.selectedItem = null;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.showCursor) return;
    if (this.isMoveSending) return;
    if (Date.now() - this.lastMouseMoveSend < this.mouseMoveDelay) return;

    this.isMoveSending = true;
    this.lastMouseMoveSend = Date.now();
    const mouseMove = new MouseMove();
    mouseMove.x = e.pageX;
    mouseMove.y = e.pageY;
    mouseMove.offsetX = this.boardPanel.nativeElement.getBoundingClientRect().left;
    mouseMove.offsetY = this.boardPanel.nativeElement.getBoundingClientRect().top;
    mouseMove.userId = this.authService.currentUserValue.id;
    mouseMove.username = this.authService.currentUserValue.username;
    this.adventureService.playerMouseMove(this.adventure.id, mouseMove).subscribe(() => {
      this.isMoveSending = false;
    })
  }

  onMouseOut(e: MouseEvent) {
    if (e.relatedTarget && this.ref.nativeElement !== e.relatedTarget) return;
    const mouseMove = new MouseMove();
    mouseMove.x = -1;
    mouseMove.y = -1;
    mouseMove.userId = this.authService.currentUserValue.id;
    this.adventureService.playerMouseMove(this.adventure.id, mouseMove).subscribe(() => {
      this.isMoveSending = false;
    });
  }

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

  focusMainDrawer() {
    this.mainDrawerContainer.nativeElement.focus();
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
  addItem(item: LayerItem) {
    if (!item) return;
    const itemToPush = {
      id: item.id,
      x: item.positionX,
      y: item.positionY,
      layerIndex: this.getLayerIndex(item.element),
      elementId: item.element.id,
      rows: item.element.rowSize,
      cols: item.element.colSize,
      name: item.element.name,
      type: item.element.type,
      dragEnabled: this.isDragEnabledForItem(item)
    };
    AdventureUtils.addSpecificToDashboardItem(itemToPush, item);
    this.dashboard.push(itemToPush);

    if (this.isSameItemAsSelected(itemToPush)) {
      this.selectedItem = itemToPush;
    }
  }

  updateItem(item: LayerItem) {
    if (!item) return;
    const dashboardItem = this.findInDashboard(item);
    if (!dashboardItem) {
      this.addItem(item);
    } else {
      this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
      this.addItem(item);
    }
  }

  selectMonster(layerItemId: number) {
    this.selectedItem = this.dashboard.find(item => item.id === layerItemId && item.type === LayerElementType.MONSTER);
    this.selectedMonsterId = layerItemId;
    this.adventureService.selectMonster(this.adventure.id, layerItemId);
  }

  removeItem(item: LayerItem) {
    if (!item) return;
    const dashboardItem = this.findInDashboard(item);
    this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
    if (this.isSameItemAsSelected(dashboardItem)) {
      this.selectedItem = null;
    }
    if (dashboardItem.type === LayerElementType.MONSTER && this.selectedMonsterId === dashboardItem.id) {
      this.selectedMonsterId = null;
    }
  }

  private isDragEnabledForItem(item: LayerItem): boolean {
    const user = this.authService.currentUserValue;

    if (user.role === ROLE_GM) return true;

    if (item.element.type === LayerElementType.CHARACTER) {
      if (!user.characters.some(char => char.name.toLowerCase() === item.element.name.toLowerCase())) return false;
      if ((item as CharacterLayerItem).character.hp === 0) return false;
      if (!this.currentTurn) return true;
      if (AdventureUtils.isMyTurn(user, this.currentTurn)
        && this.currentTurn.characterName === (item as CharacterLayerItem).character.name) {
        return true;
      }
    }

    return false;
  }

  private isDragEnabledForGridsterItem(item: LayerGridsterItem): boolean {
    const user = this.authService.currentUserValue;

    if (user.role === ROLE_GM) return true;

    if (item.type === LayerElementType.CHARACTER) {
      if (!user.characters.some(char => char.name.toLowerCase() === item.name.toLowerCase())) return false;
      if ((item as CharacterLayerGridsterItem).character.hp === 0) return false;
      if (!this.currentTurn) return true;
      if (AdventureUtils.isMyTurn(user, this.currentTurn)
        && this.currentTurn.characterName === (item as CharacterLayerGridsterItem).character.name) {
        return true;
      }
    }

    return false;
  }

  // endregion

  getCharacterNamesFromId(userId) {
    const characters = this.characters.filter(char => char.id && char.character.userId === userId);
    return characters.length !== 0 ? characters.map(char => char.name) : ['MJ'];
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
      case LayerElementType.CHARACTER:
        (baseLayerItem as CharacterLayerItem).character = this.adventure.campaignCharacters.find(char => char.name === item.name);
        break;
      default:
        break;
    }
    return baseLayerItem
  }

  tooltipDisabled(item: LayerGridsterItem): boolean {
    return !item.id || item.type !== LayerElementType.MONSTER;
  }

  private findInDashboard(item: LayerItem) {
    return this.dashboard.find(dItem => dItem.id === item.id && dItem.type === item.element.type);
  }

  private openDialog(dialog: Type<any>, data: any) {
    this.closeDialog();
    this.currentDialog = this.dialog.open(dialog, DialogUtils.getDefaultConfig(data));
    return this.currentDialog;
  }

  private closeDialog() {
    if (this.currentDialog) {
      this.currentDialog.close();
      this.currentDialog = null;
    }
  }

  private updateGridsterItem(item: LayerGridsterItem) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    this.dashboard.push({...item});
  }

  private isSameItemAsSelected(item: LayerGridsterItem): boolean {
    return this.selectedItem && this.selectedItem.type === item.type && this.selectedItem.id === item.id;
  }
}
