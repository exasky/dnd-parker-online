import {InjectableRxStompConfig, RxStompService} from '@stomp/ng2-stompjs';

import {SocketResponse} from '../../model';
import {Injectable} from "@angular/core";
import {SocketResponseType} from "../../model/websocket.response";
import {environment} from "../../../../environments/environment";

/**
 * A WebSocket wrapper that connect to back and provide addTopic method.
 */
@Injectable()
export class WebSocketWrapperService {
  private stompConfig: InjectableRxStompConfig = {
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 10000,
    webSocketFactory: () => new WebSocket('ws://' + location.host + '/stomp')
  };
  private pendingListeners: { endpoint: any, listener: any }[] = [];

  constructor(private stompService: RxStompService) {
    // Activate subscription to broker.
    if (!environment.production) {
      this.stompConfig.debug = msg => console.log(msg);
    }
    // @ts-ignore
    this.stompService.stompClient.configure(this.stompConfig);
    this.stompService.stompClient.onConnect = this.onSocketConnect.bind(this);
    this.stompService.stompClient.onStompError = this.onSocketError.bind(this);
    this.stompService.stompClient.activate();
  }

  /**
   * On each connect / reconnect, we subscribe all broker clients.
   */
  private onSocketConnect(frame) {
    this.pendingListeners.forEach(pendingListener => {
      this.stompService.stompClient.subscribe(pendingListener.endpoint, pendingListener.listener);
    })
  }

  public addTopic(brokerEndpoint, listener) {
    if (!this.stompService.stompClient.connected) {
      this.pendingListeners.push({endpoint: brokerEndpoint, listener: listener});
    } else {
      this.stompService.stompClient.subscribe(brokerEndpoint, listener);
    }
  }

  private onSocketError(errorMsg) {
    console.log('Broker reported error: ' + errorMsg);

    const response: SocketResponse = {
      type: SocketResponseType.ERROR,
      data: errorMsg
    };

    this.pendingListeners.forEach(subscriber => {
      subscriber.listener.error(response);
    });
  }

}
