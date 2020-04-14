import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";

@Component({
  selector: 'app-gm-action-panel',
  templateUrl: './gm-action-panel.component.html'
})
export class GmActionPanelComponent {
  @Input()
  monsters: Monster[];

  @Output()
  selectMonster: EventEmitter<number> = new EventEmitter<number>();
}
