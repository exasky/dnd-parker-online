import {
  ChestLayerGridsterItem,
  DoorLayerGridsterItem,
  LayerGridsterItem,
  MonsterLayerGridsterItem,
  TrapLayerGridsterItem
} from "../../../model/layer-gridster-item";
import {
  ChestLayerItem,
  DoorLayerItem,
  LayerElementType,
  LayerItem,
  MonsterLayerItem,
  TrapLayerItem
} from "../../../model/adventure";

export class AdventureUtils {
  static baseGridsterItemToLayerItem(item: LayerGridsterItem): LayerItem {
    return {
      id: item.id,
      positionX: item.x,
      positionY: item.y,
      element: {
        id: item.elementId,
        colSize: item.cols,
        rowSize: item.rows,
        type: item.type,
        name: item.name,
      }
    };
  }
  static existingGridsterItemToLayerItem(item: LayerGridsterItem): LayerItem {
    const baseLayerItem = AdventureUtils.baseGridsterItemToLayerItem(item);
    switch (baseLayerItem.element.type) {
      case LayerElementType.DOOR:
        const doorLayerItem = item as DoorLayerGridsterItem;
        (baseLayerItem as DoorLayerItem).open = doorLayerItem.open;
        (baseLayerItem as DoorLayerItem).vertical = doorLayerItem.vertical;
        break;
      case LayerElementType.TRAP:
        const trapLayerItem = item as TrapLayerGridsterItem;
        (baseLayerItem as TrapLayerItem).deactivated = trapLayerItem.deactivated;
        (baseLayerItem as TrapLayerItem).shown = trapLayerItem.shown;
        break;
      case LayerElementType.CHEST:
        const chestLayerItem = item as ChestLayerGridsterItem;
        (baseLayerItem as ChestLayerItem).specificCard = chestLayerItem.specificCard;
        break;
      case LayerElementType.MONSTER:
        const monsterLayerItem = item as MonsterLayerGridsterItem;
        (baseLayerItem as MonsterLayerItem).hp = monsterLayerItem.hp;
        (baseLayerItem as MonsterLayerItem).monster = monsterLayerItem.monster;
        break;
      default:
        break;
    }
    return baseLayerItem;
  }
}
