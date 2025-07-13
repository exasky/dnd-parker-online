export interface AlertMessage {
  characterId?: number;
  message: string;
  type: AlertMessageType;
}

export enum AlertMessageType {
  SUCCESS = "SUCCESS",
  WARN = "WARN",
  ERROR = "ERROR",
}
