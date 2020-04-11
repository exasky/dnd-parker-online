import {WebSocketWrapperService} from './web-socket-wrapper.service';
import {SocketResponse} from "../../model";
import {Observable} from "rxjs";
import {SocketResponseType} from "../../model/websocket.response";

export abstract class AbstractWebsocket {
  protected obsStompConnection: Observable<any>;
  protected subscribers: Array<any> = [];
  protected subscriberIndex = 0;

  protected constructor(private wsService: WebSocketWrapperService,
              topicName: string) {
    this.createObservableSocket();
    this.wsService.addTopic(topicName, this.socketListener.bind(this));
  }

  private createObservableSocket() {
    this.obsStompConnection = new Observable(observer => {
      const subscriberIndex = this.subscriberIndex++;
      this.addToSubscribers({index: subscriberIndex, observer});
      return () => {
        this.removeFromSubscribers(subscriberIndex);
      };
    });
  }

  private addToSubscribers(subscriber) {
    this.subscribers.push(subscriber);
  }

  private removeFromSubscribers(index) {
    for (let i = 0; i < this.subscribers.length; i++) {
      if (i === index) {
        this.subscribers.splice(i, 1);
        break;
      }
    }
  }

  private socketListener(frame) {
    this.subscribers.forEach(subscriber => {
      subscriber.observer.next(AbstractWebsocket.getMessage(frame));
    });
  }

  private static getMessage(data) {
    const response: SocketResponse = {
      type: SocketResponseType.SUCCESS,
      message: JSON.parse(data.body)
    };
    return response;
  }

  public getObservable() {
    return this.obsStompConnection;
  }
}
