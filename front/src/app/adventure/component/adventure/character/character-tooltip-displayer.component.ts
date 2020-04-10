import {Component, HostBinding, Input, OnInit} from "@angular/core";
import {Character} from "../../../model/character";

@Component({
  selector: 'app-character-tooltip-displayer',
  templateUrl: './character-tooltip-displayer.component.html',
  styleUrls: ['./character-tooltip-displayer.component.scss']
})
export class CharacterTooltipDisplayerComponent implements OnInit {
  @HostBinding('class') cssClasses = "d-flex";

  @Input()
  character: Character;

  @Input()
  cardWidth;

  @Input()
  cardHeight;

  ngOnInit(): void {
    if (!this.cardWidth) this.cardWidth = "150";
    if (!this.cardHeight) this.cardHeight = "230";
    console.log(this.cardWidth);
  }
}
