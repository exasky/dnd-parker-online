import {Component, HostBinding, Input} from "@angular/core";
import {Initiative} from "../../../model/adventure";
import {CardUtils} from "../../../../common/utils/card-utils";

@Component({
  selector: 'app-initiative-displayer',
  templateUrl: './initiative-displayer.component.html',
  styles: ['.selected {border: white 3px solid;}']
})
export class InitiativeDisplayerComponent {
  @HostBinding('class') cssClasses = 'd-flex justify-content-center align-items-center flex-wrap';

  getCharacterCharacterImage = CardUtils.getCharacterCharacterImage;

  sortedInitiatives: Initiative[];

  @Input()
  set initiatives(initiatives: Initiative[]) {
    this.sortedInitiatives = initiatives.sort((a,b) => a.number - b.number);
  }

  @Input()
  currentInitiative: Initiative;
}
