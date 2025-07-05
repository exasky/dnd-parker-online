import { Injectable } from "@angular/core";
import { WebSocketWrapperService } from "./web-socket-wrapper.service";
import { AbstractWebSocket } from "./abstract-websocket";

@Injectable({ providedIn: "root" })
export class DiceWebsocketService extends AbstractWebSocket {
  constructor(wsService: WebSocketWrapperService) {
    super(wsService, "/topic/dice");
  }
}
