import {Component, HostBinding, Input, OnInit} from "@angular/core";
import {Character} from "../../../model/character";
import {CardUtils} from "../../../../common/utils/card-utils";

@Component({
  selector: 'app-character-tooltip-displayer',
  templateUrl: './character-tooltip-displayer.component.html',
  styleUrls: ['./character-tooltip-displayer.component.scss']
})
export class CharacterTooltipDisplayerComponent implements OnInit {
  @HostBinding('class') cssClasses = "d-flex";

  CardUtils = CardUtils;

  @Input()
  character: Character;

  @Input()
  cardWidth;

  @Input()
  cardHeight;

  @Input()
  displayCard: boolean = false

  ngOnInit(): void {
    if (!this.cardWidth) this.cardWidth = '150';
    if (!this.cardHeight) this.cardHeight = '230';
  }

  getEquipmentWidth() {
    return +this.cardWidth * Math.ceil(
      Math.max(this.character.equippedItems.length, this.character.backpackItems.length)
      / 2);
  }
}
