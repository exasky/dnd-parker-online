import {Component, HostBinding, Input, OnDestroy, OnInit} from "@angular/core";
import {GmService} from "../../../service/gm.service";
import {Adventure} from "../../../model/adventure";
import {MatDialog} from "@angular/material/dialog";
import {DiceDialogComponent} from "../dice/dice-dialog.component";
import {DiceWebsocketService} from "../../../../common/service/ws/dice.websocket.service";
import {SocketResponse} from "../../../../common/model";
import {DiceService} from "../../../service/dice.service";
import {Subscription} from "rxjs";
import {DiceMessage, DiceMessageType} from "../../../model/dice-message";
import {AuthService} from "../../../../login/auth.service";
import {SocketResponseType} from "../../../../common/model/websocket.response";
import {DialogUtils} from "../../../../common/dialog/dialog.utils";

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html'
})
export class ActionPanelComponent implements OnInit, OnDestroy {
  @HostBinding('class') cssClasses = "flex-grow d-flex flex-column";

  @Input()
  adventure: Adventure;
  private subscription: Subscription;

  constructor(private gmService: GmService,
              private dialog: MatDialog,
              private diceWS: DiceWebsocketService,
              private diceService: DiceService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.subscription = this.diceWS.getObservable().subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const diceMessage: DiceMessage = receivedMsg.data;
        if (diceMessage.type === DiceMessageType.OPEN_DIALOG) {
          this.dialog.open(DiceDialogComponent, DialogUtils.getDefaultConfig(receivedMsg.data.message));
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  drawCard() {
    // Do nothing as get card from websocket
    this.gmService.drawCard(this.adventure.id).subscribe(() => {});
  }

  rollDices() {
    this.diceService.openDiceDialog();
  }

  prevAdventure() {
    this.gmService.previousAdventure(this.adventure.id);
  }

  nextAdventure() {
    this.gmService.nextAdventure(this.adventure.id);
  }
}
