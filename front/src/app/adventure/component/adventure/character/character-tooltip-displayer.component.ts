import {Component, HostBinding, Input} from "@angular/core";
import {Character} from "../../../model/character";

@Component({
  selector: 'app-character-tooltip-displayer',
  templateUrl: './character-tooltip-displayer.component.html'
})
export class CharacterTooltipDisplayerComponent {
  @HostBinding('class') cssClasses = "d-flex";

  @Input()
  character: Character;
}
