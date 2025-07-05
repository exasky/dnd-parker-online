import { Component, HostBinding, Inject, OnInit } from "@angular/core";
import { GmService } from "../../../../service/gm.service";
import { CharacterEquipment } from "../../../../model/character";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CardUtils } from "../../../../../common/utils/card-utils";
import { TranslateModule } from "@ngx-translate/core";
import { CharacterItemDisplayerComponent } from "../../../creator/character-item-displayer.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-select-card-dialog",
  templateUrl: "./select-card-dialog.component.html",
  imports: [TranslateModule, MatDialogModule, CharacterItemDisplayerComponent, CommonModule],
})
export class SelectCardDialogComponent implements OnInit {
  @HostBinding("style.height") height = "75vh";
  @HostBinding("style.width") width = "50vw";
  @HostBinding("class") cssClass = "d-flex flex-column";

  getCardImage = CardUtils.getCardImage;

  allCharacterItems: CharacterEquipment[];

  selectedCard: CharacterEquipment;

  constructor(
    private gmService: GmService,
    public dialogRef: MatDialogRef<SelectCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
  ) {}

  ngOnInit(): void {
    this.gmService.getAllCharacterItems().subscribe((value) => {
      this.allCharacterItems = value;
      if (this.data !== undefined) {
        this.selectedCard = this.allCharacterItems.find((item) => item.id === this.data);
      }
    });
  }

  setSelectedCard(ev) {
    ev.preventDefault();
    const itemId = +ev.dataTransfer.getData("text");
    const foundItem = this.allCharacterItems.find((allItem) => allItem.id === itemId);
    if (foundItem) {
      this.selectedCard = foundItem;
    }
  }

  validateCard() {
    this.dialogRef.close(this.selectedCard);
  }
}
