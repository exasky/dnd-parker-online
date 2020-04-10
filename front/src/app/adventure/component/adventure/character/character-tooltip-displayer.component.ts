import {Component, HostBinding, Input} from "@angular/core";
import {Character} from "../../../model/character";

@Component({
  selector: 'app-character-tooltip-displayer',
  templateUrl: './character-tooltip-displayer.component.html',
  styleUrls: ['./character-tooltip-displayer.component.scss']
})
export class CharacterTooltipDisplayerComponent {
  @HostBinding('class') cssClasses = "d-flex";

  @Input()
  character: Character;
}
