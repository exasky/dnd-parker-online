import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { Adventure, AdventureLog, AdventureLogType } from "../../../model/adventure";
import { AdventureWebsocketService } from "../../../../common/service/ws/adventure.websocket.service";
import { Subscription } from "rxjs";
import { SocketResponse } from "../../../../common/model";
import { SocketResponseType } from "../../../../common/model/websocket.response";
import { AdventureMessage, AdventureMessageType } from "../../../model/adventure-message";
import { TranslateModule } from "@ngx-translate/core";
import { TimeAgoPipe } from "../../../../common/pipe/time-ago.pipe";
import { EquipmentFormatterPipe } from "../../../../common/pipe/equipment-formatter.pipe";

@Component({
  selector: "app-log-panel",
  templateUrl: "./log-panel.component.html",
  styleUrls: ["./log-panel.component.scss"],
  imports: [TranslateModule, TimeAgoPipe, EquipmentFormatterPipe],
})
export class LogPanelComponent implements OnInit, OnDestroy {
  @HostBinding("class") cssClasses = "d-flex flex-column";

  @Input()
  adventure: Adventure;

  AdventureLogType = AdventureLogType;

  private adventureWSObs: Subscription;

  logs: AdventureLog[];

  constructor(
    private adventureWS: AdventureWebsocketService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.logs = this.adventure.logs.reverse();
    this.adventureWSObs = this.adventureWS.getObservable(this.adventure.id).subscribe((receivedMsg: SocketResponse) => {
      if (receivedMsg.type === SocketResponseType.SUCCESS) {
        const message: AdventureMessage = receivedMsg.data;
        if (message.type === AdventureMessageType.ADD_LOG) {
          this.logs.unshift(message.message);
          this.cdr.detectChanges();
        }
      }
    });
  }

  ngOnDestroy() {
    this.adventureWSObs.unsubscribe();
  }
}
