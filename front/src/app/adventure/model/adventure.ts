import {Character} from "./character";

export class Adventure {
  id: number;
  name: string;
  level: number;
  // Each row must have same length
  boards: Board[][];
  mjLayer: Layer;
  characterLayer: Layer;

  characters: Character[];

  constructor() {
    this.boards = [];
    this.mjLayer = new Layer();
    this.characterLayer = new Layer();
  }
}

export class Board {
  id?: number;
  boardNumber: number;
  rotation: ImageRotation;

  constructor(bn: number, rotation?: ImageRotation) {
    this.boardNumber = bn;
    this.rotation = rotation ? rotation : ImageRotation.NONE;
  }
}

export class Layer {
  id: number;
  items: LayerItem[];
}

export interface LayerItem {
  id?: number;
  positionX: number
  positionY: number;
  element: LayerElement;
}

export interface LayerElement {
  id: number;
  type: LayerElementType;
  rowSize: number;
  colSize: number;
  rotation?: ImageRotation;
  icon: string;
}

export enum LayerElementType {
  CHEST = 'CHEST',
  VERTICAL_DOOR_VERTICAL_OPENED = 'VERTICAL_DOOR_VERTICAL_OPENED',
  VERTICAL_DOOR_VERTICAL_CLOSED = 'VERTICAL_DOOR_VERTICAL_CLOSED',
  VERTICAL_DOOR_HORIZONTAL_OPENED = 'VERTICAL_DOOR_HORIZONTAL_OPENED',
  VERTICAL_DOOR_HORIZONTAL_CLOSED = 'VERTICAL_DOOR_HORIZONTAL_CLOSED',
  TRAP_ACTIVATED = 'TRAP_ACTIVATED',
  TRAP_DEACTIVATED = 'TRAP_DEACTIVATED',
  CHARACTER = 'CHARACTER',
  MONSTER = 'MONSTER',
  TREE = 'TREE',
  PYLON = 'PYLON'
}

export enum ImageRotation {
  NONE = 0, RIGHT = 90, LEFT = -90, DOWN = 180
}
