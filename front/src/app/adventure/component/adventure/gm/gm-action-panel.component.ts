import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";
import {MatDialog} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageDialogComponent} from "./alert-message-dialog.component";
import {LayerGridsterItem} from "../../../model/layer-gridster-item";

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

  @Input()
  selectedItem: LayerGridsterItem;

  @Output()
  selectMonster: EventEmitter<number> = new EventEmitter<number>();

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
}
