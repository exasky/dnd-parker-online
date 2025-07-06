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
