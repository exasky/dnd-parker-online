import {GridsterItem} from "angular-gridster2";
import {LayerElementType} from "./adventure";
import {CharacterItem} from "./character";

export interface LayerGridsterItem extends GridsterItem {
  id?: number;
  elementId: number;
  type: LayerElementType;
  name: string;
}

export interface TrapLayerGridsterItem extends LayerGridsterItem {
  shown: boolean;
  deactivated: boolean
}

export interface DoorLayerGridsterItem extends LayerGridsterItem {
  vertical: boolean;
  open: boolean
}

export interface ChestLayerGridsterItem extends LayerGridsterItem {
  specificCard: CharacterItem;
}
