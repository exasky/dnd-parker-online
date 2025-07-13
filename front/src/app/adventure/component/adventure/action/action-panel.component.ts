import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSliderModule } from "@angular/material/slider";
import { Router } from "@angular/router";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../../../login/auth.service";
import { Adventure, GM_CHAR_NAME, Initiative } from "../../../model/adventure";
import { Character } from "../../../model/character";
import { CharacterItem } from "../../../model/item";
import { AdventureService } from "../../../service/adventure.service";
import { AmbientAudioService, AudioService } from "../../../service/audio.service";
import { DiceService } from "../../../service/dice.service";
import { GmService } from "../../../service/gm.service";
import { CharacterTooltipDisplayerComponent } from "../character/character-tooltip-displayer.component";
import { InitiativeDisplayerComponent } from "../initiative/initiative-displayer.component";
import { OverlayModule } from "@angular/cdk/overlay";

@Component({
  selector: "app-action-panel",
  templateUrl: "./action-panel.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    MatSliderModule,
    MatDividerModule,
    MatButtonModule,
    NgbTooltipModule,
    CharacterTooltipDisplayerComponent,
    InitiativeDisplayerComponent,
    FormsModule,
    CommonModule,
  ],
})
export class ActionPanelComponent implements OnInit, OnDestroy {
  @HostBinding("class") cssClasses = "d-flex flex-column";

  isGm = Character.isGm;

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[] = [];

  sortedCharacterItems: CharacterItem[] = [];

  @Input()
  set characterItems(characterItems: CharacterItem[]) {
    this.sortCharactersByInitiative(characterItems);
  }

  disableActions: boolean = false;

  @Input()
  adventure: Adventure;
  private afterOpenSub: Subscription;
  private afterCloseSub: Subscription;

  constructor(
    private gmService: GmService,
    private adventureService: AdventureService,
    private dialog: MatDialog,
    private router: Router,
    private diceService: DiceService,
    public authService: AuthService,
    public audioService: AudioService,
    public ambientAudioService: AmbientAudioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.afterOpenSub = this.dialog.afterOpened.subscribe(() => {
      this.disableActions = true;
      this.cdr.detectChanges();
    });
    this.afterCloseSub = this.dialog.afterAllClosed.subscribe(() => {
      this.disableActions = false;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.afterOpenSub.unsubscribe();
    this.afterCloseSub.unsubscribe();
  }

  private sortCharactersByInitiative(characterItems: CharacterItem[]) {
    if (!this.initiatives || this.initiatives.length === 0) {
      this.sortedCharacterItems = characterItems;
      this.sortedCharacterItems.sort((c1, c2) => (c1.character.name < c2.character.name ? -1 : 1));
    } else {
      this.initiatives
        .sort((a, b) => a.number - b.number)
        .forEach((init, idx) => {
          const characterItem = characterItems.find((charItem) => charItem.character.name === init.characterName);
          this.sortedCharacterItems[idx] = characterItem
            ? characterItem
            : ({ character: { name: GM_CHAR_NAME } } as unknown as CharacterItem);
        });
    }
    this.cdr.detectChanges();
  }

  get isMyTurn(): boolean {
    if (!this.currentInitiative) return false;
    return this.authService
      .currentUserValue()
      .characters.some((char) => this.currentInitiative.characterName === char.name);
  }

  rollDices() {
    if (!this.disableActions) this.diceService.openDiceDialog(this.adventure.id);
  }

  rollInitiative() {
    if (!this.disableActions) this.gmService.rollInitiative(this.adventure.id);
  }

  resetInitiative() {
    if (!this.disableActions) this.gmService.resetInitiative(this.adventure.id);
  }

  endTurn() {
    if (!this.disableActions) this.adventureService.askNextTurn(this.adventure.id);
  }

  openMobileVersion() {
    const strWindowFeatures = "menubar=no,toolbar=no,location=no,status=no,width=599,height=" + window.outerHeight;
    window.open(this.router.url, "_blank", strWindowFeatures);
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
