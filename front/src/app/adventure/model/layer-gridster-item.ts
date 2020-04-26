import {GridsterItem} from "angular-gridster2";
import {LayerElementType} from "./adventure";
import {CharacterItem, ChestItem, DoorItem, MonsterItem, TrapItem} from "./item";

export interface LayerGridsterItem extends GridsterItem {
  id?: number;
  elementId: number;
  type: LayerElementType;
  name: string;
}

export interface TrapLayerGridsterItem extends LayerGridsterItem, TrapItem {
}

export interface DoorLayerGridsterItem extends LayerGridsterItem, DoorItem {
}

export interface ChestLayerGridsterItem extends LayerGridsterItem, ChestItem {
}

export interface MonsterLayerGridsterItem extends LayerGridsterItem, MonsterItem {
}

export interface CharacterLayerGridsterItem extends LayerGridsterItem, CharacterItem {
}
