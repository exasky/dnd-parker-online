import {Component, HostBinding, Input} from "@angular/core";
import {Initiative} from "../../../model/adventure";

@Component({
  selector: 'app-initiative-displayer',
  templateUrl: './initiative-displayer.component.html'
})
export class InitiativeDisplayerComponent {
  @HostBinding('class') cssClasses = 'd-flex justify-content-center align-items-center flex-wrap';

  @Input()
  initiatives: Initiative[]
}
