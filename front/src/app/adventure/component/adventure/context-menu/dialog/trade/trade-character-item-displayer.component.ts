import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostBinding, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { TranslateModule } from "@ngx-translate/core";
import { GetCardImagePipe } from "../../../../../../common/utils/card-utils";
import { Character, CharacterEquipment } from "../../../../../model/character";

@Component({
  selector: "app-trade-character-item-displayer",
  templateUrl: "./trade-character-item-displayer.component.html",
  styles: [".selected {background-color: rgb(160, 160, 160); border-radius: 7px; padding: 10px}"],
  imports: [TranslateModule, MatDividerModule, CommonModule, GetCardImagePipe, MatButtonModule],
})
export class TradeCharacterItemDisplayerComponent {
  @HostBinding("class") cssClasses = "flex-grow d-flex position-relative";

  @Input()
  tradeEnabled: boolean = true;

  @Input()
  character: Character;

  @Input()
  itemSelected: CharacterEquipment;

  @Output()
  equipmentSelected: EventEmitter<{ characterEquipment: CharacterEquipment; isEquipment }> = new EventEmitter<{
    characterEquipment: CharacterEquipment;
    isEquipment;
  }>();

  selectEquipment(item: CharacterEquipment, isEquipment) {
    if (this.tradeEnabled) {
      if (this.itemSelected && this.itemSelected.id === item.id) {
        this.equipmentSelected.emit({ characterEquipment: null, isEquipment });
      } else {
        this.equipmentSelected.emit({ characterEquipment: item, isEquipment });
      }
    }
  }
}
