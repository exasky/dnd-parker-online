// import { InjectableRxStompConfig, RxStompService } from "@stomp/ng2-stompjs";
import { RxStomp, RxStompConfig } from "@stomp/rx-stomp";

import { Injectable } from "@angular/core";
import { SocketResponse } from "../../model";
import { SocketResponseType } from "../../model/websocket.response";

/**
 * A WebSocket wrapper that connect to back and provide addTopic method.
 */
@Injectable({ providedIn: "root" })
export class WebSocketWrapperService extends RxStomp {
  private stompConfig: RxStompConfig = {
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 10000,
    webSocketFactory: () => new WebSocket("ws://" + location.host + "/stomp"),
  };

  private pendingListeners: { endpoint: any; listener: any }[] = [];

  constructor() {
    super();
    // Activate subscription to broker.
    // if (!environment.production) {
    //   this.stompConfig.debug = msg => console.log(msg);
    // }
    // @ts-ignore
    this.stompClient.configure(this.stompConfig);
    this.stompClient.onConnect = this.onSocketConnect.bind(this);
    this.stompClient.onStompError = this.onSocketError.bind(this);
    this.stompClient.activate();
  }

  /**
   * On each connect / reconnect, we subscribe all broker clients.
   */
  private onSocketConnect(frame) {
    this.pendingListeners.forEach((pendingListener) => {
      this.stompClient.subscribe(pendingListener.endpoint, pendingListener.listener);
    });
  }

  public addTopic(brokerEndpoint, listener) {
    if (!this.stompClient.connected) {
      this.pendingListeners.push({ endpoint: brokerEndpoint, listener: listener });
    } else {
      this.stompClient.subscribe(brokerEndpoint, listener);
    }
  }

  private onSocketError(errorMsg) {
    console.log("Broker reported error: " + errorMsg);

    const response: SocketResponse = {
      type: SocketResponseType.ERROR,
      data: errorMsg,
    };

    this.pendingListeners.forEach((subscriber) => {
      subscriber.listener.error(response);
    });
  }
}
