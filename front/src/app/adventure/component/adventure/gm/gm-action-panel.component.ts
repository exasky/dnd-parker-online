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
  SoundMacroType = SoundMacroType;

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

  sendSound(e, type: SoundType | string) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    switch (type) {
      case SoundType.BOW:
        this.gmService.playSound(this.adventureId, 'bow_' + GmActionPanelComponent.randNumber(2) + '.mp3');
        break;
      case SoundType.MELEE_SWORD:
        this.gmService.playSound(this.adventureId, 'melee_sword_' + GmActionPanelComponent.randNumber(2) + '.mp3');
        break;
      case SoundType.POTION:
        this.gmService.playSound(this.adventureId, 'potion_' + GmActionPanelComponent.randNumber(2) + '.mp3');
        break;
      case SoundType.SPELL_FIRE:
        this.gmService.playSound(this.adventureId, 'spell_fire_' + GmActionPanelComponent.randNumber(1) + '.mp3');
        break;
      case SoundType.SPELL_HEAL:
        this.gmService.playSound(this.adventureId, 'spell_heal_' + GmActionPanelComponent.randNumber(1) + '.mp3');
        break
      case SoundType.SPELL_GENERIC:
        this.gmService.playSound(this.adventureId, 'spell_generic_' + GmActionPanelComponent.randNumber(1) + '.mp3');
        break;
      case SoundType.MONSTER_HIT:
        this.gmService.playSound(this.adventureId, 'monster_death_' + GmActionPanelComponent.randNumber(1) + '.mp3');
        break;
      default:
        this.gmService.playSound(this.adventureId, type);
    }
  }

  sendMacro(e, type: SoundMacroType) {
    e.preventDefault();
    e.stopPropagation();
    switch (type) {
      case SoundMacroType.SWORDS_AND_ARROWS:
        this.timeoutMacro([SoundType.MELEE_SWORD, SoundType.BOW, SoundType.MELEE_SWORD,
          SoundType.BOW, SoundType.MELEE_SWORD, SoundType.BOW,], 3);
        break;
      default:
        break;
    }
  }

  private timeoutMacro(sounds: (SoundType | string)[], repetition = 1, minDelay = 100, maxDelay = 200) {
    const delayToAddBetweenSounds = 200;
    let addedDelay = 0;
    for (let repetitionIdx = 0; repetitionIdx < repetition; repetitionIdx++) {
      sounds.forEach(sound => {
        setTimeout(() => {
          this.sendSound(null, sound);
        }, GmActionPanelComponent.randNumber(maxDelay + addedDelay, minDelay + addedDelay));
        addedDelay += delayToAddBetweenSounds;
      });
    }
  }

  private static randNumber(max: number, min: number = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

enum SoundType {
  MELEE_SWORD, BOW, POTION, SPELL_FIRE, MONSTER_HIT, SPELL_GENERIC, SPELL_HEAL
}

enum SoundMacroType {
  SWORDS_AND_ARROWS
}
