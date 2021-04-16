import {Component, Input} from "@angular/core";
import {Adventure, Initiative} from "../../../model/adventure";
import {CharacterItem} from "../../../model/item";

@Component({
  selector: 'app-top-action-panel-left',
  templateUrl: './top-action-panel-left.component.html',
  styleUrls: ['./top-action-panel-left.component.scss']
})
export class TopActionPanelLeftComponent {
  @Input()
  characterItems: CharacterItem[] = [];

  @Input()
  currentInitiative: Initiative;

  constructor() {
  }
}
