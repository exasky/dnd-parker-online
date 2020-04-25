import {LayerElement} from "./adventure";

export class MonsterTemplate {
  id: number;
  maxHp: number;
  movePoints: number;
  armor: number;
  element: LayerElement;
}

export class Monster {
  layerItemId: number;
  name: string;
  index: number;
  hp: number;
}
