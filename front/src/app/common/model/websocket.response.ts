export class SocketResponse {
  type: SocketResponseType;
  data: any;
}

export enum SocketResponseType {
  SUCCESS, ERROR
}
