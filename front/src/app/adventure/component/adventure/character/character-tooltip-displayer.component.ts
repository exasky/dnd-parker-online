import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { TranslateModule } from "@ngx-translate/core";
import { GetCardImagePipe, GetCharacterImagePipe } from "../../../../common/utils/card-utils";
import { Character } from "../../../model/character";

@Component({
  selector: "app-character-tooltip-displayer",
  templateUrl: "./character-tooltip-displayer.component.html",
  styleUrls: ["./character-tooltip-displayer.component.scss"],
  imports: [TranslateModule, MatProgressBarModule, CommonModule, GetCharacterImagePipe, GetCardImagePipe],
})
export class CharacterTooltipDisplayerComponent implements OnInit {
  @HostBinding("class") cssClasses = "d-flex";

  @Input()
  character: Character;

  @Input()
  cardWidth;

  @Input()
  cardHeight;

  @Input()
  displayCard: boolean = false;

  ngOnInit(): void {
    if (!this.cardWidth) this.cardWidth = "150";
    if (!this.cardHeight) this.cardHeight = "230";
  }

  getEquipmentWidth() {
    return (
      +this.cardWidth *
      Math.ceil(Math.max(this.character.equippedItems.length, this.character.backpackItems.length) / 2)
    );
  }
}
