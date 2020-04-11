export class SocketResponse {
  type: SocketResponseType;
  message: any;
}

export enum SocketResponseType {
  SUCCESS, ERROR
}
