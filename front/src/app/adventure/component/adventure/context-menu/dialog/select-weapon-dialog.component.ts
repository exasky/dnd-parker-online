import { Component, HostBinding, Inject } from "@angular/core";
import { Character, CharacterEquipment } from "../../../../model/character";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CardUtils } from "../../../../../common/utils/card-utils";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { DragOverDirective } from "../../../../../common/directive/drag-over.directive";

@Component({
  selector: "app-select-card-dialog",
  templateUrl: "./select-weapon-dialog.component.html",
  styles: [":host {height: 75vh; width: 50vw; margin: auto}"],
  imports: [TranslateModule, MatDialogModule, CommonModule, MatButtonModule, DragOverDirective],
})
export class SelectWeaponDialogComponent {
  @HostBinding("class") cssClass = "d-flex flex-column";

  getCardImage = CardUtils.getCardImage;

  selectedCard: CharacterEquipment;

  constructor(
    public dialogRef: MatDialogRef<SelectWeaponDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { character: Character },
  ) {}

  dragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData("text/plain", item.id + "");
    ev.dataTransfer.dropEffect = "copy";
  }

  setSelectedCard(ev) {
    ev.preventDefault();
    const itemId = +ev.dataTransfer.getData("text");
    const foundItem = this.data.character.equippedItems.find((allItem) => allItem.id === itemId);
    if (foundItem) {
      this.selectedCard = foundItem;
    }
  }

  validateCard() {
    this.dialogRef.close(this.selectedCard);
  }
}
