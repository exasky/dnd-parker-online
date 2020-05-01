import {Component, HostBinding, Input} from "@angular/core";
import {CharacterEquipment} from "../../model/character";
import {StringUtils} from "../../../common/utils/string-utils";
import {ItemDisplayer, ItemNode} from "../../../common/component/item.displayer";
import {CardUtils} from "../../../common/utils/card-utils";

@Component({
  selector: 'app-character-item-displayer',
  templateUrl: './character-item-displayer.component.html'
})
export class CharacterItemDisplayerComponent extends ItemDisplayer<CharacterEquipment> {
  @HostBinding('class') cssClass = 'd-flex flex-column'

  getCardImage = CardUtils.getCardImage;

  @Input()
  set characterItems(characterItems: CharacterEquipment[]) {
    this.elements = characterItems;
    this.filterDataSource('');
  }

  protected filterDataSource(filterText: string) {
    const data: ItemNode[] = [];
    const splitFilter = filterText.split(' ');
    this.elements.forEach(characterItem => {
      if (StringUtils.isFilter(splitFilter, characterItem.name.split('_'))) {
        let typeNode = data.find(value => value.name === characterItem.type);
        if (!typeNode) {
          typeNode = {name: characterItem.type, children: []};
          data.push(typeNode);
        }
        if (characterItem.level) { // Card case
          let levelNode = typeNode.children.find(value => value.name === characterItem.level + '');
          if (!levelNode) {
            levelNode = {name: characterItem.level + '', children: []};
            typeNode.children.push(levelNode);
          }
          levelNode.children.push(characterItem);
        } else { // Item case
          typeNode.children.push(characterItem);
        }
      }
    });
    data.forEach(typeNode => typeNode.children.sort((a, b) => a.name < b.name ? -1 : 1));
    data.sort((a, b) => a.name < b.name ? -1 : 1);
    this.dataSource.data = data;
  }

  dragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData('text/plain', item.id + '');
    ev.dataTransfer.dropEffect = 'copy';
  }
}
