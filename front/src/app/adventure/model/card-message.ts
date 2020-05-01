export class CardMessage {
  type: CardMessageType
  message: any;
}

export enum CardMessageType {
  DRAW_CARD = 'DRAW_CARD',
  SELECT_EQUIPMENT = 'SELECT_EQUIPMENT'
}
