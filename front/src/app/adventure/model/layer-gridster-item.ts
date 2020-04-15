import {GridsterItem} from "angular-gridster2";
import {ImageRotation, LayerElementType} from "./adventure";

export interface LayerGridsterItem extends GridsterItem {
  id?: number;
  elementId: number;
  type: LayerElementType;
  icon: string;
  rotation: ImageRotation;
}
