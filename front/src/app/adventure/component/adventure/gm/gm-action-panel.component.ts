import {Component, EventEmitter, HostBinding, Input, Output} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {AlertMessageDialogComponent} from "./alert-message-dialog.component";
import {GmService} from "../../../service/gm.service";
import {AdventureService} from "../../../service/adventure.service";
import {Router} from "@angular/router";
import {MatDrawer} from "@angular/material/sidenav";
import {Initiative, MonsterLayerItem} from "../../../model/adventure";
import {CharacterItem, MonsterItem} from "../../../model/item";

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
  initiatives: Initiative[];

  @Input()
  characters: CharacterItem[];

  @Input()
  monsters: MonsterItem[];

  @Input()
  selectedMonsterId: number;

  @Output()
  selectMonster: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  cursorEnabled = true;

  @Output()
  toggleCursor: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  exportable: MatDrawer;

  constructor(private dialog: MatDialog,
              private router: Router,
              private gmService: GmService,
              private adventureService: AdventureService,) {
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

  updateMonster(monster: MonsterItem) {
    this.gmService.updateMonster(this.adventureId, monster as MonsterLayerItem);
  }

  updateCharacter(charItem: CharacterItem) {
    this.adventureService.updateCharacter(this.adventureId, charItem.character);
  }

  updateInitiatives() {
    this.gmService.updateInitiatives(this.adventureId, this.initiatives);
  }

  openMobileVersion() {
    const strWindowFeatures = "menubar=no,toolbar=no,location=no,status=no,width=599,height=" + window.outerHeight;
    window.open(this.router.url, '_blank', strWindowFeatures);
    this.exportable.close();
  }

}

enum SoundType {
  MELEE_SWORD, BOW, POTION, SPELL_FIRE, MONSTER_HIT, SPELL_GENERIC, SPELL_HEAL
}

enum SoundMacroType {
  SWORDS_AND_ARROWS
}
