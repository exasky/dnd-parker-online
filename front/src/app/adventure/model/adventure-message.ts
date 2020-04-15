export class AdventureMessage {
  type: AdventureMessageType
  message: any;
}

export enum AdventureMessageType {
  UPDATE_CHARACTERS = 'UPDATE_CHARACTERS',
  GOTO = 'GOTO',
  MOUSE_MOVE = 'MOUSE_MOVE',
  ADD_LAYER_ITEM = 'ADD_LAYER_ITEM',
  UPDATE_LAYER_ITEM = 'UPDATE_LAYER_ITEM',
  REMOVE_LAYER_ITEM = 'REMOVE_LAYER_ITEM',
  SELECT_CHARACTER = 'SELECT_CHARACTER',
  SHOW_TRAP = 'SHOW_TRAP'
}

export class MouseMove {
  userId: number;
  username: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
