import {
  CharacterLayerGridsterItem,
  ChestLayerGridsterItem,
  DoorLayerGridsterItem,
  LayerGridsterItem,
  MonsterLayerGridsterItem,
  TrapLayerGridsterItem
} from "../../../model/layer-gridster-item";
import {
  CharacterLayerItem,
  ChestLayerItem,
  DoorLayerItem, Initiative,
  LayerElementType,
  LayerItem,
  MonsterLayerItem,
  TrapLayerItem
} from "../../../model/adventure";
import {Character} from "../../../model/character";
import {GridsterItem} from "angular-gridster2";
import {User} from "../../../../user/user";

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
      case LayerElementType.CHARACTER:
        const characterLayerItem = item as CharacterLayerGridsterItem;
        (baseLayerItem as CharacterLayerItem).character = characterLayerItem.character;
        break;
      default:
        break;
    }
    return baseLayerItem;
  }

  static updateCharacter(character: Character, toUpdateCharacters: Character[]): void {
    const toUpdate = toUpdateCharacters.find(advChar => advChar.id === character.id);
    if (toUpdate) {
      toUpdate.maxHp = character.maxHp;
      toUpdate.hp = character.hp;
      toUpdate.maxMp = character.maxMp;
      toUpdate.mp = character.mp;
      toUpdate.equippedItems = character.equippedItems;
      toUpdate.backpackItems = character.backpackItems;
    }
  }

  static addSpecificToDashboardItem(dashboardItem: GridsterItem, layerItem: LayerItem) {
    switch (layerItem.element.type) {
      case LayerElementType.CHARACTER:
        const characterItem: CharacterLayerItem = layerItem as CharacterLayerItem;
        const characterGridsterItem: CharacterLayerGridsterItem = dashboardItem as CharacterLayerGridsterItem;
        characterGridsterItem.character = characterItem.character;
        break;
      case LayerElementType.DOOR:
        const doorItem: DoorLayerItem = layerItem as DoorLayerItem;
        const doorGridsterItem = dashboardItem as DoorLayerGridsterItem;
        doorGridsterItem.vertical = doorItem.vertical;
        doorGridsterItem.open = doorItem.open;
        break;
      case LayerElementType.TRAP:
        const trapItem: TrapLayerItem = layerItem as TrapLayerItem;
        const trapGridsterItem = dashboardItem as TrapLayerGridsterItem;
        trapGridsterItem.shown = trapItem.shown;
        trapGridsterItem.deactivated = trapItem.deactivated;
        break;
      case LayerElementType.CHEST:
        const chestItem = layerItem as ChestLayerItem;
        const chestGridsterItem = dashboardItem as ChestLayerGridsterItem;
        chestGridsterItem.specificCard = chestItem.specificCard;
        break;
      case LayerElementType.MONSTER:
        const monsterItem = layerItem as MonsterLayerItem;
        const monsterGridsterItem = dashboardItem as MonsterLayerGridsterItem;
        monsterGridsterItem.hp = monsterItem.hp;
        monsterGridsterItem.monster = monsterItem.monster;
        break;
      default:
        break;
    }
  }

  static isMyTurn(currentUser: User, currentInitiative: Initiative): boolean {
    return currentUser.characters.some(char => currentInitiative.characterName === char.name);
  }
}
