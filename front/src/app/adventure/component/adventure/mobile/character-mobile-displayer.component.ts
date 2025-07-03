import { Component, HostBinding, Input } from "@angular/core";
import { Character, CharacterEquipment } from "../../../model/character";
import { AdventureService } from "../../../service/adventure.service";
import { SelectCardDialogComponent } from "../context-menu/dialog/select-card-dialog.component";
import { DialogUtils } from "../../../../common/dialog/dialog.utils";
import { MatDialog } from "@angular/material/dialog";
import { CardUtils } from "../../../../common/utils/card-utils";
import { MatCardModule } from "@angular/material/card";
import { TranslateModule } from "@ngx-translate/core";
import { MatSliderModule } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-character-mobile-displayer",
  templateUrl: "./character-mobile-displayer.component.html",
  styleUrls: ["./character-mobile-displayer.component.scss"],
  imports: [
    MatCardModule,
    TranslateModule,
    MatSliderModule,
    FormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
  ],
})
export class CharacterMobileDisplayerComponent {
  @HostBinding("class") cssClasses = "d-flex flex-column h-100";

  CardUtils = CardUtils;

  @Input()
  character: Character;

  @Input()
  editable: boolean = false;

  @Input()
  adventureId;

  constructor(
    private adventureService: AdventureService,
    private dialog: MatDialog,
  ) {}

  updateCharacter(character: Character) {
    this.adventureService.updateCharacter(this.adventureId, character);
  }

  openSelectCardEquippedItem() {
    this.dialog
      .open(SelectCardDialogComponent, DialogUtils.getDefaultConfig())
      .afterClosed()
      .subscribe((value: CharacterEquipment) => {
        if (value) {
          this.character.equippedItems.push(value);
          this.updateCharacter(this.character);
        }
      });
  }

  openSelectCardBackPackItem() {
    this.dialog
      .open(SelectCardDialogComponent, DialogUtils.getDefaultConfig())
      .afterClosed()
      .subscribe((value: CharacterEquipment) => {
        if (value) {
          this.character.backpackItems.push(value);
          this.updateCharacter(this.character);
        }
      });
  }

  addEquippedItem(ev: DragEvent) {
    if (this.editable) {
      this.transferItem(ev, this.character.equippedItems);
    }
  }

  removeEquipmentItem(item: CharacterEquipment) {
    if (this.editable) {
      this.character.equippedItems.splice(this.character.equippedItems.indexOf(item), 1);
      this.updateCharacter(this.character);
    }
  }

  addBackPackItem(ev: DragEvent) {
    if (this.editable) {
      this.transferItem(ev, this.character.backpackItems);
    }
  }

  removeBackpackItem(item: CharacterEquipment) {
    if (this.editable) {
      this.character.backpackItems.splice(this.character.backpackItems.indexOf(item), 1);
      this.updateCharacter(this.character);
    }
  }

  private transferItem(ev, toItemList: CharacterEquipment[]) {
    ev.preventDefault();
    const moveItem: { item: number; isFromEquipment: boolean } = JSON.parse(ev.dataTransfer.getData("text"));

    const fromItemList = moveItem.isFromEquipment ? this.character.equippedItems : this.character.backpackItems;
    const itemToMove = fromItemList.find((item) => item.id == moveItem.item);

    toItemList.push(itemToMove);
    fromItemList.splice(fromItemList.indexOf(itemToMove), 1);

    this.updateCharacter(this.character);
  }

  equipmentDragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData("text/plain", JSON.stringify({ item: item.id, isFromEquipment: true }));
    ev.dataTransfer.dropEffect = "move";
  }

  backpackDragStartHandler(ev: DragEvent, item: CharacterEquipment) {
    ev.dataTransfer.setData("text/plain", JSON.stringify({ item: item.id, isFromEquipment: false }));
    ev.dataTransfer.dropEffect = "move";
  }
}
