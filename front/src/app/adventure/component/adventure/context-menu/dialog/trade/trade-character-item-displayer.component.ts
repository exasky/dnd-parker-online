import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Character, CharacterEquipment} from "../../../../../model/character";
import {CardUtils} from "../../../../../../common/utils/card-utils";

@Component({
  selector: 'app-trade-character-item-displayer',
  templateUrl: './trade-character-item-displayer.component.html',
  styles: ['.selected {background-color: rgb(160, 160, 160); border-radius: 7px; padding: 10px}']
})
export class TradeCharacterItemDisplayerComponent {
  @HostBinding('class') cssClasses = 'flex-grow d-flex position-relative';

  getCardImage = CardUtils.getCardImage;

  @Input()
  tradeEnabled: boolean = true;

  @Input()
  character: Character;

  @Input()
  itemSelected: CharacterEquipment;

  @Output()
  equipmentSelected: EventEmitter<{ characterEquipment: CharacterEquipment, isEquipment }> = new EventEmitter<{ characterEquipment: CharacterEquipment, isEquipment }>();

  selectEquipment(item: CharacterEquipment, isEquipment) {
    if (this.tradeEnabled) {
      if (this.itemSelected && this.itemSelected.id === item.id) {
        this.equipmentSelected.emit({characterEquipment: null, isEquipment})
      } else {
        this.equipmentSelected.emit({characterEquipment: item, isEquipment})
      }
    }
  }
}
