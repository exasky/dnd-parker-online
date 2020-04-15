import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";

@Component({
  selector: 'app-gm-action-panel',
  templateUrl: './gm-action-panel.component.html',
  styleUrls: ['./gm-action-panel.component.scss']
})
export class GmActionPanelComponent {
  @HostBinding('class') cssClasses = 'd-flex';

  selectedMonster: Monster;

  @Input()
  monsters: Monster[];

  @Output()
  selectMonster: EventEmitter<number> = new EventEmitter<number>();

  internalSelectMonster(monster: Monster) {
    this.selectedMonster = monster;
    this.selectMonster.emit(monster.layerItemId);
  }
}
