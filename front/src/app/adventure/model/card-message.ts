export class CardMessage {
  type: CardMessageType
  message: any;
}

export enum CardMessageType {
  DRAW_CARD = 'DRAW_CARD',
  CLOSE_DIALOG = 'CLOSE_DIALOG'
}
