import {Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
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
import {ToasterService} from "../../../../common/service/toaster.service";
import {AudioService} from "../../../service/audio.service";
import {CharacterItem, MonsterItem} from "../../../model/item";
import {LayerElementType, LayerItem} from "../../../model/adventure";
import {LayerGridsterItem} from "../../../model/layer-gridster-item";

@Component({
  selector: 'app-dice-attack-dialog',
  templateUrl: './dice-attack-dialog.component.html',
})
export class DiceAttackDialogComponent implements OnInit, OnDestroy {

  @ViewChildren('diceCmp') diceComponents: QueryList<DiceComponent>;

  LayerElementType = LayerElementType;

  rollDisabled = true;

  allDices: Dice[];
  selectedDices: Dice[] = [];

  diceWSObs: Subscription;

  constructor(private gmService: GmService,
              public authService: AuthService,
              private diceWS: DiceWebsocketService,
              private diceService: DiceService,
              private toaster: ToasterService,
              private audioService: AudioService,
              @Inject(MAT_DIALOG_DATA) public data: {
                adventureId: string,
                user: SimpleUser,
                fromAttack: LayerGridsterItem,
                toAttack: LayerGridsterItem
              }) {
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