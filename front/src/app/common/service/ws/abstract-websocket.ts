import {WebSocketWrapperService} from './web-socket-wrapper.service';
import {SocketResponse} from "../../model";
import {Observable, Subscriber} from "rxjs";
import {SocketResponseType} from "../../model/websocket.response";

export abstract class AbstractWebSocket {
  protected obsStompConnections: Map<any, Observable<any>>;
  protected subscribers: Map<any, Array<Subscriber<any>>>;

  protected constructor(private wsService: WebSocketWrapperService,
                        protected topicNamePrefix: string) {
    this.obsStompConnections = new Map<any, Observable<any>>();
    this.subscribers = new Map<any, Array<any>>();
  }

  public getObservable(identifier) {
    if (!this.obsStompConnections.has(identifier)) {
      this.obsStompConnections.set(identifier, new Observable(observer => {
        this.addToSubscribers(identifier, observer);
        return () => {
          this.removeFromSubscribers(identifier, observer);
        };
      }));
      this.wsService.addTopic(this.topicNamePrefix + '/' + identifier, this.socketListener.bind(this, identifier));
    }
    return this.obsStompConnections.get(identifier);
  }

  private addToSubscribers(identifier, subscriber: Subscriber<any>) {
    if (!this.subscribers.has(identifier)) {
      this.subscribers.set(identifier, []);
    }
    this.subscribers.get(identifier).push(subscriber);
  }

  private removeFromSubscribers(identifier, observer) {
    const subArray = this.subscribers.get(identifier);
    const obsIdx = subArray.indexOf(observer);
    subArray.splice(obsIdx, 1);
  }

  private socketListener(identifier, frame) {
    this.subscribers.get(identifier).forEach(subscriber => {
      subscriber.next(AbstractWebSocket.getMessage(frame));
    });
  }

  private static getMessage(data) {
    const response: SocketResponse = {
      type: SocketResponseType.SUCCESS,
      data: JSON.parse(data.body)
    };
    return response;
  }
}
