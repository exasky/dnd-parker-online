import {Character} from "./character";
import {ChestItem, DoorItem, MonsterItem, TrapItem} from "./item";

export class Adventure {
  id: number;
  name: string;
  level: number;
  // Each row must have same length
  boards: Board[][];
  traps: TrapLayerItem[];
  doors: DoorLayerItem[];
  chests: ChestLayerItem[];
  monsters: MonsterLayerItem[];
  otherItems: LayerItem[];

  characterTurns: Initiative[];

  characters: Character[];

  constructor() {
    this.boards = [];
    this.traps = [];
    this.doors = [];
    this.otherItems = []
  }
}

export class Initiative {
  characterName: string;
  number: number;
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

export interface LayerItem {
  id?: number;
  positionX: number
  positionY: number;
  element: LayerElement;
}

export interface TrapLayerItem extends LayerItem, TrapItem {
}

export interface DoorLayerItem extends LayerItem, DoorItem {
}

export interface ChestLayerItem extends LayerItem, ChestItem {
}

export interface MonsterLayerItem extends LayerItem, MonsterItem {
}

export interface LayerElement {
  id: number;
  type: LayerElementType;
  rowSize: number;
  colSize: number;
  name: string;
}

export enum LayerElementType {
  CHEST = 'CHEST',
  DOOR = 'DOOR',
  TRAP = 'TRAP',
  CHARACTER = 'CHARACTER',
  MONSTER = 'MONSTER',
  TREE = 'TREE',
  PILLAR = 'PILLAR'
}

export enum ImageRotation {
  NONE = 0, RIGHT = 90, LEFT = -90, DOWN = 180
}
