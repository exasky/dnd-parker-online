export class AdventureMessage {
  type: AdventureMessageType
  message: any;
}

export enum AdventureMessageType {
  UPDATE_CAMPAIGN = 'UPDATE_CAMPAIGN',
  UPDATE_CHARACTER = 'UPDATE_CHARACTER',
  GOTO = 'GOTO',
  MOUSE_MOVE = 'MOUSE_MOVE',
  ADD_LAYER_ITEM = 'ADD_LAYER_ITEM',
  UPDATE_LAYER_ITEM = 'UPDATE_LAYER_ITEM',
  REMOVE_LAYER_ITEM = 'REMOVE_LAYER_ITEM',
  SELECT_CHARACTER = 'SELECT_CHARACTER',
  SELECT_MONSTER = 'SELECT_MONSTER',
  ALERT = 'ALERT',
  SOUND = 'SOUND',
}

export class MouseMove {
  userId: number;
  username: string;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}
