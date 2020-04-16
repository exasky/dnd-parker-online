import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {Monster} from "../../../model/monster";
import {MatDialog} from "@angular/material/dialog";
import {Character} from "../../../model/character";
import {AlertMessageDialogComponent} from "./alert-message-dialog.component";
import {LayerGridsterItem} from "../../../model/layer-gridster-item";
import {GmService} from "../../../service/gm.service";

@Component({
  selector: 'app-gm-action-panel',
  templateUrl: './gm-action-panel.component.html',
  styleUrls: ['./gm-action-panel.component.scss']
})
export class GmActionPanelComponent {
  @HostBinding('class') cssClasses = 'flex-grow d-flex';

  SoundType = SoundType;

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

  constructor(private dialog: MatDialog,
              private gmService: GmService) {
  }

  sendAlert() {
    this.dialog.open(AlertMessageDialogComponent, {
      data: {
        adventureId: this.adventureId,
        characters: this.characters
      }
    });
  }

  sendSound(type: SoundType | string) {
    switch (type) {
      case SoundType.BOW:
        break;
      case SoundType.MELEE_SWORD:
        this.gmService.playSound(this.adventureId, 'melee_sword_' + this.randNumber(1) + '.wav')
        break;
      case SoundType.POTION:
        this.gmService.playSound(this.adventureId, 'potion_' + this.randNumber(2) + '.wav')
        break;
      default:
        this.gmService.playSound(this.adventureId, type);
    }
  }

  private randNumber(max: number) {
    return Math.floor(Math.random() * (max + 1));
  }
}

enum SoundType {
  MELEE_SWORD, BOW, POTION
}
