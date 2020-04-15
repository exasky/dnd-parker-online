import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";
import {MatDialog} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageDialogComponent} from "./alert-message-dialog.component";

@Component({
  selector: 'app-gm-action-panel',
  templateUrl: './gm-action-panel.component.html',
  styleUrls: ['./gm-action-panel.component.scss']
})
export class GmActionPanelComponent {
  @HostBinding('class') cssClasses = 'flex-grow d-flex';

  @Input()
  adventureId: number;

  @Input()
  characters: Character[];

  @Input()
  monsters: Monster[];

  @Output()
  selectedMonsterChange: EventEmitter<Monster> = new EventEmitter<Monster>();

  constructor(private dialog: MatDialog) {
  }

  sendAlert() {
    this.dialog.open(AlertMessageDialogComponent, {
      data: {
        adventureId: this.adventureId,
        characters: this.characters
      }
    });
  }

  private _selectedMonster: Monster;

  @Input()
  get selectedMonster(): Monster {
    return this._selectedMonster;
  }

  set selectedMonster(monster: Monster) {
    this._selectedMonster = monster;
    this.selectedMonsterChange.emit(monster);
  }
}
