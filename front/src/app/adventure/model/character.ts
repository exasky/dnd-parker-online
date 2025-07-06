import { GM_CHAR_NAME } from "./adventure";

export interface CharacterTemplate {
  id: number;
  name: string;
  displayName: string;
  backpackSize: number;
}

export class Character {
  id?: number;
  name: string;
  displayName: string;

  hp: number;
  maxHp: number;

  mp: number;
  maxMp: number;

  equippedItems: CharacterEquipment[];
  backpackItems: CharacterEquipment[];
  backpackSize: number;

  userId?: number;
  userName?: string;

  constructor() {
    this.equippedItems = [];
    this.backpackItems = [];
  }

  static isGm(char: Character) {
    return char.name === GM_CHAR_NAME;
  }
}

export interface CharacterEquipment {
  id: number;
  name: string;
  level: number;
  type: ItemType;

  // TODO Real item values ? As damage, dices, effets..
}

export enum ItemType {
  ARTIFACT = "ARTIFACT",
  POTION = "POTION",
  SPELL = "SPELL",
  WEAPON = "WEAPON",
  TRAP = "TRAP",
  ITEM = "ITEM",
}
