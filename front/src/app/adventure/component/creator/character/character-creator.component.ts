import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { DragOverDirective } from "../../../../common/directive/drag-over.directive";
import { GetCardImagePipe, GetCharacterImagePipe } from "../../../../common/utils/card-utils";
import { Character, CharacterEquipment, CharacterTemplate } from "../../../model/character";

@Component({
  selector: "app-character-creator",
  templateUrl: "./character-creator.component.html",
  imports: [
    TranslateModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    DragOverDirective,
    GetCardImagePipe,
    GetCharacterImagePipe,
  ],
})
export class CharacterCreatorComponent {
  @HostBinding("class") cssClasses = "d-flex";

  @Input()
  character: Character;

  /* use to know position TODO comment*/
  @Input()
  positionInList: number;

  @Input()
  allCharacters: Character[];

  @Input()
  availableCharacters: CharacterTemplate[];

  @Input()
  allCharacterItems: CharacterEquipment[];

  @Output()
  deleteEvent: EventEmitter<Character> = new EventEmitter<Character>();

  @Output()
  selectCharacterEvent: EventEmitter<CharacterTemplate> = new EventEmitter<CharacterTemplate>();

  addEquippedItem(ev: DragEvent) {
    this.transferItem(ev, this.character.equippedItems);
  }

  removeEquipmentItem(item: CharacterEquipment) {
    this.character.equippedItems.splice(this.character.equippedItems.indexOf(item), 1);
  }

  addBackPackItem(ev: DragEvent) {
    this.transferItem(ev, this.character.backpackItems);
  }

  removeBackpackItem(item: CharacterEquipment) {
    this.character.backpackItems.splice(this.character.backpackItems.indexOf(item), 1);
  }

  private transferItem(ev, toItemList: CharacterEquipment[]) {
    ev.preventDefault();
    try {
      // Move case
      const moveItem: { from: number; item: number; isFromEquipment: boolean } = JSON.parse(
        ev.dataTransfer.getData("text"),
      );

      const character = this.allCharacters[moveItem.from];
      const fromItemList = moveItem.isFromEquipment ? character.equippedItems : character.backpackItems;
      const itemToMove = fromItemList.find((item) => item.id == moveItem.item);

      toItemList.push(itemToMove);
      fromItemList.splice(fromItemList.indexOf(itemToMove), 1);
    } catch (e) {
      // Add case
      const itemId = +ev.dataTransfer.getData("text");
      const foundItem = this.allCharacterItems.find((allItem) => allItem.id === itemId);
      if (foundItem) {
        toItemList.push(foundItem);
      }
    }
  }

  equipmentDragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        from: this.positionInList,
        item: item.id,
        isFromEquipment: true,
      }),
    );
    ev.dataTransfer.dropEffect = "move";
  }

  backpackDragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        from: this.positionInList,
        item: item.id,
        isFromEquipment: false,
      }),
    );
    ev.dataTransfer.dropEffect = "move";
  }

  selectCharacter(event: MatSelectChange) {
    const selectedCharacterTemplate = this.availableCharacters.find((ac) => ac.displayName === event.value);
    this.character.name = selectedCharacterTemplate.name;
    this.character.displayName = selectedCharacterTemplate.displayName;
    this.selectCharacterEvent.emit(selectedCharacterTemplate);
  }

  deleteCharacter() {
    this.deleteEvent.emit(this.character);
  }
}
