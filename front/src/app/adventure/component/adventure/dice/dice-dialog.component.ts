import {Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {GmService} from "../../../service/gm.service";
import {Dice} from "../../../model/dice";
import {Subscription} from "rxjs";
import {DiceComponent} from "./dice.component";
import {LoginService} from "../../../../login/login.service";
import {DiceWebsocketService} from "../../../../common/service/dice.websocket.service";
import {DiceService} from "../../../service/dice.service";
import {SocketResponse} from "../../../../common/model";
import {DiceMessage, DiceMessageType} from "../../../model/dice-message";

@Component({
  selector: 'app-dice-dialog',
  templateUrl: './dice-dialog.component.html',
})
export class DiceDialogComponent implements OnInit, OnDestroy {

  @ViewChildren('diceCmp') diceComponents: QueryList<DiceComponent>;

  disabled = true;

  allDices: Dice[];
  selectedDices: Dice[] = [];

  diceWSObs: Subscription;

  constructor(private gmService: GmService,
              public loginService: LoginService,
              private diceWS: DiceWebsocketService,
              private diceService: DiceService,
              @Inject(MAT_DIALOG_DATA) public data: number) {
  }

  ngOnInit(): void {
    this.disabled = !this.loginService.isGM && !(this.loginService.currentUserValue.id === this.data);
    this.gmService.getAllDices().subscribe(dices => this.allDices = dices);
    this.diceWS.getObservable().subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === 'SUCCESS') {
        const diceMessage: DiceMessage = receivedMsg.message;
        if (diceMessage.type === DiceMessageType.SELECT_DICES) {
          this.selectedDices
            = diceMessage.message.map(diceId => this.allDices.find(allDice => allDice.id === diceId));
        } else if (diceMessage.type === DiceMessageType.ROLL_RESULT) {
          const results: number[] = diceMessage.message;
          if (results.length !== this.diceComponents.length) {
            throw new Error('[WS:ROLL_RESULT] Result length incorrect');
          }
          this.diceComponents.forEach((diceComp, index) => {
            diceComp.value = results[index];
          });
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.diceWSObs.unsubscribe();
  }

  addToDiceList(dice: Dice) {
    if (!this.disabled) {
      this.selectedDices.push(dice);
      this.diceService.selectDices(this.selectedDices.map(dice => dice.id));
    }
  }

  removeDiceFromList(dice: Dice) {
    if (!this.disabled) {
      this.selectedDices.splice(this.selectedDices.indexOf(dice), 1);
      this.diceService.selectDices(this.selectedDices.map(dice => dice.id));
    }
  }

  rollDices() {
    this.diceService.rollDices(this.selectedDices.map(dice => dice.id));
  }
}
