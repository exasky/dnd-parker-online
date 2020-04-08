import {Component, HostBinding, Input} from "@angular/core";
import {Character, CharacterItem} from "../../../model/character";

@Component({
  selector: 'app-character-creator',
  templateUrl: './character-creator.component.html'
})
export class CharacterCreatorComponent {
  @HostBinding('class') cssClasses = "d-flex";

  @Input()
  character: Character;

  /* use to know position TODO comment*/
  @Input()
  positionInList: number;

  @Input()
  allCharacters: Character[];

  @Input()
  allCharacterItems: CharacterItem[]


  addEquippedItem(ev: DragEvent) {
    this.transferItem(ev, this.character.equippedItems);
  }

  removeEquipmentItem(item: CharacterItem) {
    this.character.equippedItems.splice(this.character.equippedItems.indexOf(item), 1);
  }

  addBackPackItem(ev: DragEvent) {
    this.transferItem(ev, this.character.backpackItems);
  }

  removeBackpackItem(item: CharacterItem) {
    this.character.backpackItems.splice(this.character.backpackItems.indexOf(item), 1);
  }

  private transferItem(ev, toItemList: CharacterItem[]) {
    ev.preventDefault();
    try {
      // Move case
      const moveItem: {from: number, item: number, isFromEquipment: boolean} = JSON.parse(ev.dataTransfer.getData("text"))

      const character = this.allCharacters[moveItem.from];
      const fromItemList = moveItem.isFromEquipment ? character.equippedItems : character.backpackItems;
      const itemToMove = fromItemList.find(item => item.id == moveItem.item);

      toItemList.push(itemToMove);
      fromItemList.splice(fromItemList.indexOf(itemToMove), 1);
    } catch (e) {
      // Add case
      const itemId = +ev.dataTransfer.getData("text");
      const foundItem = this.allCharacterItems.find(allItem => allItem.id === itemId);
      if (foundItem) {
        toItemList.push(foundItem);
      }
    }
  }

  equipmentDragStartHandler(ev: DragEvent, item: CharacterItem) {
    ev.dataTransfer.setData('text/plain', JSON.stringify({from: this.positionInList, item: item.id, isFromEquipment: true}));
    ev.dataTransfer.dropEffect = 'move';
  }

  backpackDragStartHandler(ev: DragEvent, item: CharacterItem) {
    ev.dataTransfer.setData('text/plain', JSON.stringify({from: this.positionInList, item: item.id, isFromEquipment: false}));
    ev.dataTransfer.dropEffect = 'move';
  }

}
