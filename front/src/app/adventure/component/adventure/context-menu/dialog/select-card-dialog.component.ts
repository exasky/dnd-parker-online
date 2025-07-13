import { CommonModule } from "@angular/common";
import { Component, HostBinding, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { TranslateModule } from "@ngx-translate/core";
import { DragOverDirective } from "../../../../../common/directive/drag-over.directive";
import { GetCardImagePipe } from "../../../../../common/utils/card-utils";
import { CharacterEquipment } from "../../../../model/character";
import { GmService } from "../../../../service/gm.service";
import { CharacterItemDisplayerComponent } from "../../../creator/character-item-displayer.component";

@Component({
  selector: "app-select-card-dialog",
  templateUrl: "./select-card-dialog.component.html",
  imports: [
    TranslateModule,
    MatDialogModule,
    CharacterItemDisplayerComponent,
    CommonModule,
    MatButtonModule,
    GetCardImagePipe,
    DragOverDirective,
  ],
})
export class SelectCardDialogComponent implements OnInit {
  @HostBinding("style.height") height = "75vh";
  @HostBinding("class") cssClass = "d-flex flex-column";

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

  setSelectedCard(ev: DragEvent) {
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
