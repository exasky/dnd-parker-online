import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AmbientAudioService, AudioService} from "../../../service/audio.service";
import {DiceService} from "../../../service/dice.service";
import {Adventure, Initiative} from "../../../model/adventure";
import {CharacterItem} from "../../../model/item";
import {Character} from "../../../model/character";
import {AdventureService} from "../../../service/adventure.service";
import {AuthService} from "../../../../login/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-top-action-panel-right',
  templateUrl: './top-action-panel-right.component.html'
})
export class TopActionPanelRightComponent implements OnInit, OnDestroy {
  @Input()
  adventure: Adventure;

  @Input()
  currentInitiative: Initiative;

  @Input()
  initiatives: Initiative[] = [];

  disableActions: boolean = false;
  private afterOpenSub: Subscription;
  private afterCloseSub: Subscription;

  constructor(private adventureService: AdventureService,
              private diceService: DiceService,
              public authService: AuthService,
              public audioService: AudioService,
              public ambientAudioService: AmbientAudioService,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) {
  }

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

  rollDices() {
    if (!this.disableActions) this.diceService.openDiceDialog(this.adventure.id);
  }

  get isMyTurn(): boolean {
    if (!this.currentInitiative) return false;
    return this.authService.currentUserValue.characters.some(char => this.currentInitiative.characterName === char.name);
  }

  endTurn() {
    if (!this.disableActions) this.adventureService.askNextTurn(this.adventure.id);
  }
}
