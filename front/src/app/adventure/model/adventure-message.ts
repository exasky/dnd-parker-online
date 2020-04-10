export class AdventureMessage {
  type: AdventureMessageType
  message: any;
}

export enum AdventureMessageType {
  RELOAD = 'RELOAD',
  GOTO = 'GOTO'
}
