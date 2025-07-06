import { Pipe, PipeTransform } from "@angular/core";
import { Character, CharacterEquipment, ItemType } from "../../adventure/model/character";
import { MonsterTemplate } from "../../adventure/model/monster";

@Pipe({ name: "getCardImage" })
export class GetCardImagePipe implements PipeTransform {
  transform(item: CharacterEquipment) {
    if (item.type === ItemType.ITEM) {
      return "assets/card/" + item.type.toLowerCase() + "/" + item.name + ".png";
    } else {
      return "assets/card/" + item.type.toLowerCase() + "/" + item.level + "/" + item.name + ".jpg";
    }
  }
}

@Pipe({ name: "getMonsterImage" })
export class GetMonsterImagePipe implements PipeTransform {
  transform(monster: MonsterTemplate, description: boolean = false) {
    return this.getMonsterImageSuffix(monster, description ? "description" : null);
  }

  private getMonsterImageSuffix = (monster: MonsterTemplate, suffix: string) =>
    "assets/monster/" + monster.element.name + (suffix ? "-" + suffix : "") + ".jpg";
}

type imgTypes = null | "wearables" | "card" | "character" | "characteristics" | "token";
@Pipe({ name: "getCharacterImage" })
export class GetCharacterImagePipe implements PipeTransform {
  transform(character: Character | string, imgType: imgTypes = null) {
    return this.getCharacterImageSuffix(character, imgType);
  }

  private getCharacterImageSuffix(character: Character | string, suffix: imgTypes) {
    return (
      "assets/character/" +
      (character["name"] ? character["name"] : character).toLowerCase() +
      (suffix ? "-" + suffix : "") +
      ".jpg"
    );
  }
}

export class CardUtils {
  static getCardImage(item: CharacterEquipment) {
    if (item.type === ItemType.ITEM) {
      return "assets/card/" + item.type.toLowerCase() + "/" + item.name + ".png";
    } else {
      return "assets/card/" + item.type.toLowerCase() + "/" + item.level + "/" + item.name + ".jpg";
    }
  }

  // region Character
  static getCharacterImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, null);
  }

  static getCharacterWearablesImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, "wearables");
  }

  static getCharacterCardImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, "card");
  }

  static getCharacterCharacterImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, "character");
  }

  static getCharacterCharacteristicsImage(character: Character | string) {
    return CardUtils.getCharacterImageSuffix(character, "characteristics");
  }

  private static getCharacterImageSuffix(character: Character | string, suffix: string) {
    return (
      "assets/character/" +
      (character["name"] ? character["name"] : character).toLowerCase() +
      (suffix ? "-" + suffix : "") +
      ".jpg"
    );
  }
  // endregion

  // region Monster

  static getMonsterDescriptionImage(monster: MonsterTemplate) {
    return CardUtils.getMonsterImageSuffix(monster, "description");
  }

  private static getMonsterImageSuffix(monster: MonsterTemplate, suffix: string) {
    return "assets/monster/" + monster.element.name + (suffix ? "-" + suffix : "") + ".jpg";
  }
  // endregion
}
