import { Component, HostBinding, Inject } from "@angular/core";
import { Character, CharacterEquipment } from "../../../../model/character";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CardUtils } from "../../../../../common/utils/card-utils";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-select-card-dialog",
  templateUrl: "./select-weapon-dialog.component.html",
  imports: [TranslateModule, MatDialogModule, CommonModule],
})
export class SelectWeaponDialogComponent {
  @HostBinding("style.height") height = "75vh";
  @HostBinding("style.width") width = "50vw";
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
