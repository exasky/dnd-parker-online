import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";

@Component({
  selector: 'app-gm-action-panel',
  templateUrl: './gm-action-panel.component.html',
  styleUrls: ['./gm-action-panel.component.scss']
})
export class GmActionPanelComponent {
  @HostBinding('class') cssClasses = 'd-flex';

  private _selectedMonster: Monster;

  @Input()
  get selectedMonster(): Monster {
    return this._selectedMonster;
  }

  @Input()
  monsters: Monster[];

  @Output()
  selectedMonsterChange: EventEmitter<Monster> = new EventEmitter<Monster>();

  set selectedMonster(monster: Monster) {
    this._selectedMonster = monster;
    this.selectedMonsterChange.emit(monster);
  }
}
