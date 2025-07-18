import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { Component, HostBinding, Input, output } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { Router } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { CapitalizePipe } from "../../../../common/pipe/capitalize.pipe";
import { SortPipe } from "../../../../common/pipe/sort.pipe";
import { MobileService } from "../../../../common/service/mobile.service";
import { GetCharacterImagePipe, GetMonsterImagePipe } from "../../../../common/utils/card-utils";
import { Initiative, MonsterLayerItem } from "../../../model/adventure";
import { CharacterItem, MonsterItem } from "../../../model/item";
import { AdventureService } from "../../../service/adventure.service";
import { GmService } from "../../../service/gm.service";
import { AlertMessageDialogComponent } from "./alert-message-dialog.component";

@Component({
  selector: "app-gm-action-panel",
  templateUrl: "./gm-action-panel.component.html",
  styleUrls: ["./gm-action-panel.component.scss"],
  imports: [
    MatExpansionModule,
    MatIconModule,
    TranslateModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CapitalizePipe,
    MatSliderModule,
    MatSelectModule,
    CommonModule,
    SortPipe,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    GetMonsterImagePipe,
    CdkDropList,
    CdkDrag,
    GetCharacterImagePipe,
  ],
})
export class GmActionPanelComponent {
  @HostBinding("class") cssClasses = "flex-grow d-flex";

  SoundType = SoundType;
  SoundMacroType = SoundMacroType;

  @Input()
  adventureId: number;

  _initiatives: Initiative[];
  @Input()
  set initiatives(initiatives: Initiative[]) {
    this._initiatives = (JSON.parse(JSON.stringify(initiatives)) as Initiative[]).sort((a, b) =>
      a.number < b.number ? -1 : 1,
    );
  }

  @Input()
  characters: CharacterItem[];

  @Input()
  monsters: MonsterItem[];

  @Input()
  selectedMonsterId: number;

  @Input()
  cursorEnabled = true;

  @Input()
  exportable: MatDrawer;

  toggleCursor = output<void>();
  selectMonster = output<number>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private gmService: GmService,
    private adventureService: AdventureService,
    public mobileService: MobileService,
  ) {}

  sendAlert() {
    this.dialog.open(AlertMessageDialogComponent, {
      data: {
        adventureId: this.adventureId,
        characters: this.characters.map((charItem) => charItem.character),
      },
    });
  }

  sendSound(e, type: SoundType | string) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    switch (type) {
      case SoundType.BOW:
        this.gmService.playSound(this.adventureId, "bow_" + GmActionPanelComponent.randNumber(2) + ".mp3");
        break;
      case SoundType.MELEE_SWORD:
        this.gmService.playSound(this.adventureId, "melee_sword_" + GmActionPanelComponent.randNumber(2) + ".mp3");
        break;
      case SoundType.POTION:
        this.gmService.playSound(this.adventureId, "potion_" + GmActionPanelComponent.randNumber(2) + ".mp3");
        break;
      case SoundType.SPELL_FIRE:
        this.gmService.playSound(this.adventureId, "spell_fire_" + GmActionPanelComponent.randNumber(1) + ".mp3");
        break;
      case SoundType.SPELL_HEAL:
        this.gmService.playSound(this.adventureId, "spell_heal_" + GmActionPanelComponent.randNumber(1) + ".mp3");
        break;
      case SoundType.SPELL_GENERIC:
        this.gmService.playSound(this.adventureId, "spell_generic_" + GmActionPanelComponent.randNumber(1) + ".mp3");
        break;
      case SoundType.MONSTER_HIT:
        this.gmService.playSound(this.adventureId, "monster_death_" + GmActionPanelComponent.randNumber(1) + ".mp3");
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
        this.timeoutMacro(
          [
            SoundType.MELEE_SWORD,
            SoundType.BOW,
            SoundType.MELEE_SWORD,
            SoundType.BOW,
            SoundType.MELEE_SWORD,
            SoundType.BOW,
          ],
          3,
        );
        break;
      default:
        break;
    }
  }

  sendAmbient(e, type: string) {
    e.preventDefault();
    e.stopPropagation();
    this.gmService.playAmbientSound(this.adventureId, type);
  }

  private timeoutMacro(sounds: (SoundType | string)[], repetition = 1, minDelay = 100, maxDelay = 200) {
    const delayToAddBetweenSounds = 200;
    let addedDelay = 0;
    for (let repetitionIdx = 0; repetitionIdx < repetition; repetitionIdx++) {
      sounds.forEach((sound) => {
        setTimeout(
          () => {
            this.sendSound(null, sound);
          },
          GmActionPanelComponent.randNumber(maxDelay + addedDelay, minDelay + addedDelay),
        );
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

  dropInitiative(event: CdkDragDrop<any>) {
    moveItemInArray(this._initiatives, event.previousIndex, event.currentIndex);
    this._initiatives.forEach((init, idx) => (init.number = idx));
  }

  updateInitiatives() {
    this.gmService.updateInitiatives(this.adventureId, this._initiatives);
  }

  openMobileVersion() {
    const strWindowFeatures = "menubar=no,toolbar=no,location=no,status=no,width=599,height=" + window.outerHeight;
    window.open(this.router.url, "_blank", strWindowFeatures);
    this.exportable.close();
  }
}

enum SoundType {
  MELEE_SWORD,
  BOW,
  POTION,
  SPELL_FIRE,
  MONSTER_HIT,
  SPELL_GENERIC,
  SPELL_HEAL,
}

enum SoundMacroType {
  SWORDS_AND_ARROWS,
}
