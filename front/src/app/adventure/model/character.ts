export class CharacterTemplate {
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

  constructor() {
    this.equippedItems = [];
    this.backpackItems = [];
  }
}

export class CharacterEquipment {
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
