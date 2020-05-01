import {Character, CharacterEquipment, ItemType} from "../../adventure/model/character";
import {MonsterTemplate} from "../../adventure/model/monster";

export class CardUtils {
  static getCardImage(item: CharacterEquipment) {
    if (item.type === ItemType.ITEM) {
      return 'assets/card/' + item.type.toLowerCase() + '/' + item.name + '.png';
    } else {
      return 'assets/card/' + item.type.toLowerCase() + '/' + item.level + '/' + item.name + '.jpg';
    }
  }

  // region Character
  static getCharacterImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, null);
  }

  static getCharacterWearablesImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, 'wearables');
  }

  static getCharacterCardImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, 'card');
  }

  static getCharacterCharacterImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, 'character');
  }

  static getCharacterCharacteristicsImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, 'characteristics');
  }

  private static getCharacterImageSuffix(character: Character | string, suffix: string) {
    return 'assets/character/'
      + ((character['name'] ? character['name'] : character).toLowerCase())
      + (suffix ? '-' + suffix : '')
      + '.jpg';
  }
  // endregion

  // region Monster
  static getMonsterImage(monster: MonsterTemplate) {
    return CardUtils.getMonsterImageSuffix(monster, null);
  }

  static getMonsterDescriptionImage(monster: MonsterTemplate) {
    return CardUtils.getMonsterImageSuffix(monster, 'description');
  }

  private static getMonsterImageSuffix(monster: MonsterTemplate, suffix: string) {
    return 'assets/monster/' + monster.element.name + (suffix ? '-' + suffix : '') + '.jpg';
  }
  // endregion
}
