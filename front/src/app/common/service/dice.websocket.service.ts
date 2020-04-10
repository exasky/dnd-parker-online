import {Injectable} from '@angular/core';
import {WebSocketWrapperService} from './web-socket-wrapper.service';
import {AbstractWebsocket} from "./abstract-websocket";

@Injectable()
export class DiceWebsocketService extends AbstractWebsocket {

  constructor(wsService: WebSocketWrapperService) {
    super(wsService, '/topic/dice');
  }

}
