import {InjectableRxStompConfig, RxStompService} from '@stomp/ng2-stompjs';

import {SocketResponse} from '../model';
import {Injectable} from "@angular/core";

/**
 * A WebSocket wraper that connect to back and provide addTopic method.
 */
@Injectable()
export class WebSocketWrapperService {
  private subscribers: Array<any> = [];
  private stompConfig: InjectableRxStompConfig = {
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 10000,
    webSocketFactory: () => new WebSocket('ws://' + location.host + '/stomp'),
    debug: (str) => {
      console.log(str);
    }
  };
  private pendingListeners: {endpoint: any, listener: any}[] = [];

  constructor(private stompService: RxStompService) {
    // Initialise a list of possible subscribers.
    // this.createObservableSocket();
    // Activate subscription to broker.
    this.connect();
  }

  /**
   * Connect and activate the client to the broker.
   */
  private connect = () => {
    // @ts-ignore
    this.stompService.stompClient.configure(this.stompConfig);
    this.stompService.stompClient.onConnect = this.onSocketConnect;
    this.stompService.stompClient.onStompError = this.onSocketError;
    this.stompService.stompClient.activate();
  }

  /**
   * On each connect / reconnect, we subscribe all broker clients.
   */
  private onSocketConnect = frame => {
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

  private onSocketError = errorMsg => {
    console.log('Broker reported error: ' + errorMsg);

    const response: SocketResponse = {
      type: 'ERROR',
      message: errorMsg
    };

    this.subscribers.forEach(subscriber => {
      subscriber.observer.error(response);
    });
  }

}
