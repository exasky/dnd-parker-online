import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Adventure, Board, ImageRotation} from "../../../model/adventure";
import {CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType} from "angular-gridster2";

@Component({
  selector: 'app-adventure-creator',
  templateUrl: './adventure-creator.component.html',
  styleUrls: ['./adventure-creator.component.scss']
})
export class AdventureCreatorComponent implements OnInit {
  @Output()
  adventureDeleted: EventEmitter<void> = new EventEmitter<void>();

  _adventure: Adventure;

  availableBoards: Board[] = Array.from(Array(10), (_, i) => i + 1).map(boardNumber => {
    return {
      boardNumber,
      rotation: ImageRotation.NONE
    }
  })
  gridsterBoards: GridsterItem[] = [];

  options: GridsterConfig;

  @Input()
  set adventure(adventure: Adventure) {
    this._adventure = adventure;
    this.gridsterBoards = [];
    this.adventure.boards.forEach((row, rowIdx) => {
      row.forEach((board, colIdx) => {
        if (board) {
          this.gridsterBoards.push({
            x: colIdx,
            y: rowIdx,
            rows: 1,
            cols: 1,
            board: board
          })
        }
      })
    })
  }

  get adventure() {
    return this._adventure;
  }

  constructor() {
  }

  ngOnInit() {
    this.options = {
      gridType: GridType.Fixed,
      compactType: CompactType.None,
      margin: 0,
      outerMargin: true,
      outerMarginTop: 5,
      outerMarginRight: 5,
      outerMarginBottom: 5,
      outerMarginLeft: 5,
      useTransformPositioning: true,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 300,
      fixedRowHeight: 300,
      minCols: 2,
      maxCols: 5,
      minRows: 2,
      maxRows: 5,
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
      },
      swap: false,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: {north: true, east: true, south: true, west: true},
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: true,
      disableWarnings: false,
      scrollToNewItems: false,
      allowMultiLayer: true,
      itemChangeCallback: this.updateBoards.bind(this)
    };
  }

  // region first step
  dragStartHandler(ev, board: Board) {
    ev.dataTransfer.setData('text/plain', board.boardNumber);
    ev.dataTransfer.dropEffect = 'copy';
  }

  emptyCellDropCallback(event: MouseEvent, item: GridsterItem) {
    const boardNumber = +(event as any).dataTransfer.getData('text');
    const boardToAdd = JSON.parse(JSON.stringify(this.availableBoards.find(board => board.boardNumber === boardNumber)));
    this.gridsterBoards.push({
      ...item,
      board: boardToAdd
    });

    this.updateBoards();
  }

  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.gridsterBoards.splice(this.gridsterBoards.indexOf(item), 1);
    this.updateBoards();
  }

  rotateRight(board: Board) {
    switch (board.rotation) {
      case ImageRotation.DOWN:
        board.rotation = ImageRotation.LEFT;
        break;
      case ImageRotation.LEFT:
        board.rotation = ImageRotation.NONE;
        break;
      case ImageRotation.NONE:
        board.rotation = ImageRotation.RIGHT;
        break;
      case ImageRotation.RIGHT:
        board.rotation = ImageRotation.DOWN;
        break;
    }

    this.updateBoards();
  }

  rotateLeft(board: Board) {
    switch (board.rotation) {
      case ImageRotation.DOWN:
        board.rotation = ImageRotation.RIGHT;
        break;
      case ImageRotation.RIGHT:
        board.rotation = ImageRotation.NONE;
        break;
      case ImageRotation.NONE:
        board.rotation = ImageRotation.LEFT;
        break;
      case ImageRotation.LEFT:
        board.rotation = ImageRotation.DOWN;
        break;
    }

    this.updateBoards();
  }

  updateBoards() {
    this._adventure.boards = []
    this.gridsterBoards.forEach(value => {
      const row = value.y;
      const col = value.x;

      if (!this.adventure.boards[row]) {
        this.adventure.boards[row] = []
      }
      this.adventure.boards[row][col] = {
        boardNumber: value.board.boardNumber,
        rotation: value.board.rotation
      }
    })
  }
}
