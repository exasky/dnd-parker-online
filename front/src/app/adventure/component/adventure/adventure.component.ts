import {Component, HostBinding, OnDestroy, OnInit} from "@angular/core";
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
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../../../login/login.service";
import {ROLE_GM} from "../../../user/user";
import {AdventureWebsocketService} from "../../../common/service/adventure.websocket.service";
import {SocketResponse} from "../../../common/model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-board',
  templateUrl: './adventure.component.html',
  styleUrls: ['./adventure.component.scss']
})
export class AdventureComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  adventureWSObs: Subscription;

  layerElementType = LayerElementType;

  adventure: Adventure;

  addableLayerElements: LayerElement[];

  options: GridsterConfig;
  dashboard: GridsterItem[];

  gamePanelXSize = 0;
  gamePanelYSize = 0;

  constructor(private adventureService: AdventureService,
              private mjService: GmService,
              public loginService: LoginService,
              private route: ActivatedRoute,
              private adventureWS: AdventureWebsocketService) {
  }

  ngOnInit() {
    this.mjService.getAddableElements().subscribe(elements => this.addableLayerElements = elements);
    this.adventureService.getAdventure(this.route.snapshot.paramMap.get("id")).subscribe(adventure => {
      this.adventure = adventure;
      const currentUser = this.loginService.currentUserValue;
      currentUser.currentCharacter = this.adventure.characters.find(character => character.userId === currentUser.id);

      this.gamePanelYSize = this.adventure.boards.length;
      this.gamePanelXSize = this.adventure.boards.map((row: Board[]) => row.length).sort()[0];

      this.initGridsterConf();
      this.initDashboard();
    });

    const obs = this.adventureWS.getObservable();
    this.adventureWSObs = obs.subscribe({
      next: (receivedMsg: SocketResponse) => {
        if (receivedMsg.type === 'SUCCESS') {
          this.adventure = receivedMsg.message;
          // Update existing items of else create
          this.adventure.mjLayer.items.forEach(mjItem => {
            this.updateItem(mjItem, 0);
          });
          this.adventure.characterLayer.items.forEach(characterItem => {
            this.updateItem(characterItem, 1);
          })

          // Remove others
          const allLayerIds = this.adventure.mjLayer.items.map(value => value.id)
            .concat(this.adventure.characterLayer.items.map(value => value.id));
          this.removeUnusedItems(allLayerIds);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.adventureWSObs.unsubscribe();
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
      // displayGrid: DisplayGrid.OnDragAndResize,
      displayGrid: DisplayGrid.Always,
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

  changedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  emptyCellDropCallback(event: MouseEvent, item: GridsterItem) {
    const layerElementId = +(event as any).dataTransfer.getData('text');
    const elementToAdd = this.addableLayerElements.find(le => le.id === layerElementId);

    let itemToPush = {
      ...item,
      elementId: elementToAdd.id,
      cols: elementToAdd.colSize,
      rows: elementToAdd.rowSize,
      layerIndex: 0,
      icon: elementToAdd.icon,
      rotation: elementToAdd.rotation,
      type: elementToAdd.type
    };
    this.addSpecificToDashboardItem(itemToPush, elementToAdd);
    this.dashboard.push(itemToPush)

    this.saveAdventure();
  }

  itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface) {
    this.saveAdventure();
  }

  removeItem(item: GridsterItem, $event?) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    this.saveAdventure();
  }

  removeUnusedItems(existingIds: number[]) {
    const dashboardItemsToRemove = this.dashboard.filter(dashboardItem => existingIds.indexOf(dashboardItem.id) === -1);
    dashboardItemsToRemove.forEach(toRemove => this.removeItem(toRemove, null));
  }

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
      dragEnabled: this.isDragEnabledForItem(item, layerIndex)
    };
    this.addSpecificToDashboardItem(itemToPush, item.element);
    this.dashboard.push(itemToPush)
  }

  updateItem(item: LayerItem, layerIndex = 0) {
    const dashboardItem = this.dashboard.find(dashboardItem => dashboardItem.id === item.id);
    if (!dashboardItem) {
      this.addItem(item, layerIndex);
    } else {
      // Update item only if position unchanged
      if (dashboardItem.x !== item.positionX || dashboardItem.y !== item.positionY) {
        dashboardItem.x = item.positionX;
        dashboardItem.y = item.positionY;
        this.dashboard.splice(this.dashboard.indexOf(dashboardItem), 1);
        this.dashboard.push({...dashboardItem}); // Force re-insert with different reference
      }
      this.addSpecificToDashboardItem(dashboardItem, item.element);
    }
  }

  private addSpecificToDashboardItem(dashboardItem: GridsterItem, layerElement: LayerElement) {
    if (layerElement.type === LayerElementType.CHARACTER) {
      dashboardItem['character']
        = this.adventure.characters.find(char => layerElement.icon.toLowerCase().indexOf(char.name.toLowerCase()) !== -1);
    }
  }

  private isDragEnabledForItem(item: LayerItem, layerIndex: number): boolean {
    const user = this.loginService.currentUserValue;

    return user.role === ROLE_GM || (
      item.element.type === LayerElementType.CHARACTER && item.element.icon === user.currentCharacter.name)
    // TODO check character id ?
  }

  saveAdventure() {
    this.adventure.mjLayer.items = [];
    this.adventure.characterLayer.items = [];
    this.dashboard.forEach(value => {
      const currentLayer = value.layerIndex === 0 ? this.adventure.mjLayer : this.adventure.characterLayer;
      currentLayer.items.push({
        id: value.id,
        positionX: value.x,
        positionY: value.y,
        element: {
          id: value.elementId,
          colSize: value.cols,
          rowSize: value.rows,
          type: value.type,
          icon: value.icon,
          rotation: value.rotation
        }
      })
    })
    this.adventureService.update(this.adventure).subscribe(() => {
    });
  }

}
