import { LayerElement } from "./adventure";

export interface MonsterTemplate {
  id: number;
  maxHp: number;
  movePoints: number;
  armor: number;
  element: LayerElement;
}
