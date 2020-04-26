import {Character, CharacterEquipment} from "./character";
import {MonsterTemplate} from "./monster";

export interface TrapItem {
  id?: number;
  shown: boolean;
  deactivated: boolean;
}

export interface DoorItem {
  id?: number;
  vertical: boolean;
  open: boolean
}

export interface ChestItem {
  id?: number;
  specificCard: CharacterEquipment;
}

export interface MonsterItem {
  id?: number;
  hp: number;
  monster: MonsterTemplate;
}

export interface CharacterItem {
  character: Character;
}
