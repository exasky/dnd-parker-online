import {Character} from "./character";
import {CharacterItem, ChestItem, DoorItem, MonsterItem, TrapItem} from "./item";

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
  characters: CharacterLayerItem[];
  otherItems: LayerItem[];

  logs: AdventureLog[];

  currentTurn: Initiative;
  characterTurns: Initiative[];

  campaignCharacters: Character[];

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

  static isGmTurn(init: Initiative) {
    return init.characterName === GM_CHAR_NAME;
  }
}

export const GM_CHAR_NAME = 'game-master';

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

export interface CharacterLayerItem extends LayerItem, CharacterItem {
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

export class AdventureLog {
  id: number;
  logDate: any;
  type: AdventureLogType;
  from: string;
  fromId: string;
  to: string;
  toId: string;
}

export enum AdventureLogType {
  TRADE = 'TRADE',
  SWITCH = 'SWITCH',
  ATTACK = 'ATTACK',
  DIE = 'DIE',
  OPEN_CHEST = 'OPEN_CHEST'
}
