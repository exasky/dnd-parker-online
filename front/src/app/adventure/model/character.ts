export class Character {
  id?: number;
  name: string;

  hp: number;
  maxHp: number;

  mp: number;
  maxMp: number;

  equippedItems: CharacterItem[];
  backpackItems: CharacterItem[];
  backpackSize: number;

  constructor() {
    this.equippedItems = [];
    this.backpackItems = [];
  }
}

export class CharacterItem {
  id: number;
  name: string;
  level: number;
  type: ItemType;

  // TODO Real item values ? As damage, dices, effets..
}

export enum ItemType {
  ARTIFACT = 'ARTIFACT',
  POTION = 'POTION',
  SPELL = 'SPELL',
  WEAPON = 'WEAPON',
  TRAP = 'TRAP'
}
