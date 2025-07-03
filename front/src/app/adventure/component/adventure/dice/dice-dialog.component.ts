import { Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren, Directive } from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {GmService} from "../../../service/gm.service";
import {AuthService} from "../../../../login/auth.service";
import {DiceWebsocketService} from "../../../../common/service/ws/dice.websocket.service";
import {DiceService} from "../../../service/dice.service";
import {SimpleUser} from "../../../model/simple-user";
import {ToasterService} from "../../../../common/service/toaster.service";
import {AudioService} from "../../../service/audio.service";
import {DiceComponent} from "./dice.component";
import {Dice} from "../../../model/dice";
import {Subscription} from "rxjs";
import {SocketResponse} from "../../../../common/model";
import {SocketResponseType} from "../../../../common/model/websocket.response";
import {DiceMessage, DiceMessageType} from "../../../model/dice-message";
import {LayerGridsterItem} from "../../../model/layer-gridster-item";
import {LayerElementType} from "../../../model/adventure";
import {CardUtils} from "../../../../common/utils/card-utils";
import {CharacterEquipment} from "../../../model/character";

@Directive()
abstract class AbstractDiceDialogComponent implements OnInit, OnDestroy {
  @ViewChildren('diceCmp') diceComponents: QueryList<DiceComponent>;

  LayerElementType = LayerElementType;

  rollDisabled = true;

  allDices: Dice[];
  selectedDices: Dice[] = [];
  diceWSObs: Subscription;

  protected constructor(protected gmService: GmService,
                        public authService: AuthService,
                        protected diceWS: DiceWebsocketService,
                        protected diceService: DiceService,
                        protected toaster: ToasterService,
                        protected audioService: AudioService,
                        public data: { adventureId: string, user: SimpleUser }) {
  }

  ngOnInit(): void {
    this.rollDisabled = !this.authService.isGM && !(this.authService.currentUserValue.id === this.data.user.id);
    this.diceService.getAllDices().subscribe(dices => this.allDices = dices);
    this.diceWSObs = this.diceWS.getObservable(this.data.adventureId).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
        switch (diceMessage.type) {
          case DiceMessageType.SELECT_DICES:
            this.selectedDices = diceMessage.message.map(diceId => this.allDices.find(allDice => allDice.id === diceId));
            break;
          case DiceMessageType.ROLL_RESULT:
            const results: number[] = diceMessage.message;
            if (results.length !== this.diceComponents.length) {
              console.log('[WS:ROLL_RESULT] Result length incorrect');
              this.toaster.warning('A player is doing shit... Please stop');
            } else {
              this.diceComponents.forEach((diceComp, index) => {
                diceComp.value = results[index];
              });
              this.audioService.playSound('/assets/sound/roll_dice.mp3');
            }
            break;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.diceWSObs.unsubscribe();
  }

  addToDiceList(dice: Dice) {
    if (!this.rollDisabled) {
      this.selectedDices.push(dice);
      this.diceService.selectDices(this.data.adventureId, this.selectedDices.map(dice => dice.id));
    }
  }

  removeDiceFromList(dice: Dice) {
    if (!this.rollDisabled) {
      this.selectedDices.splice(this.selectedDices.indexOf(dice), 1);
      this.diceService.selectDices(this.data.adventureId, this.selectedDices.map(dice => dice.id));
    }
  }

  rollDices() {
    this.diceService.rollDices(this.data.adventureId, this.selectedDices.map(dice => dice.id));
  }

  close() {
    this.diceService.closeDialog(this.data.adventureId);
  }
}

@Component({
  selector: 'app-dice-dialog',
  templateUrl: './dice-dialog.component.html',
})
export class DiceDialogComponent extends AbstractDiceDialogComponent {
  constructor(protected gmService: GmService,
              public authService: AuthService,
              protected diceWS: DiceWebsocketService,
              protected diceService: DiceService,
              protected toaster: ToasterService,
              protected audioService: AudioService,
              @Inject(MAT_DIALOG_DATA) public data: { adventureId: string, user: SimpleUser }) {
    super(gmService, authService, diceWS, diceService, toaster, audioService, data);
  }
}

@Component({
  selector: 'app-dice-attack-dialog',
  templateUrl: './dice-attack-dialog.component.html',
})
export class DiceAttackDialogComponent extends AbstractDiceDialogComponent {
  CardUtils = CardUtils;

  constructor(protected gmService: GmService,
              public authService: AuthService,
              protected diceWS: DiceWebsocketService,
              protected diceService: DiceService,
              protected toaster: ToasterService,
              protected audioService: AudioService,
              @Inject(MAT_DIALOG_DATA) public data: {
                adventureId: string,
                user: SimpleUser,
                fromAttack: LayerGridsterItem,
                toAttack: LayerGridsterItem,
                fromAttackWeapon?: CharacterEquipment
              }) {
    super(gmService, authService, diceWS, diceService, toaster, audioService, data);
  }
}
