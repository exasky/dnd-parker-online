export class AdventureMessage {
  type: AdventureMessageType
  message: any;
}

export enum AdventureMessageType {
  RELOAD = 'RELOAD',
  GOTO = 'GOTO',
  MOUSE_MOVE = 'MOUSE_MOVE'
}

export class MouseMove {
  userId: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
