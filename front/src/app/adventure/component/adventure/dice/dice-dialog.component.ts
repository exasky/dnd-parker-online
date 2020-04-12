import {Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {GmService} from "../../../service/gm.service";
import {Dice} from "../../../model/dice";
import {Subscription} from "rxjs";
import {DiceComponent} from "./dice.component";
import {AuthService} from "../../../../login/auth.service";
import {DiceWebsocketService} from "../../../../common/service/ws/dice.websocket.service";
import {DiceService} from "../../../service/dice.service";
import {SocketResponse} from "../../../../common/model";
import {DiceMessage, DiceMessageType} from "../../../model/dice-message";
import {SocketResponseType} from "../../../../common/model/websocket.response";
import {SimpleUser} from "../../../model/simple-user";

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
              public authService: AuthService,
              private diceWS: DiceWebsocketService,
              private diceService: DiceService,
              public dialogRef: MatDialogRef<DiceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SimpleUser) {
  }

  ngOnInit(): void {
    this.disabled = !this.authService.isGM && !(this.authService.currentUserValue.id === this.data.id);
    this.gmService.getAllDices().subscribe(dices => this.allDices = dices);
    this.diceWSObs = this.diceWS.getObservable().subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
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
