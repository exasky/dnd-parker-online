export interface DiceMessage {
  type: DiceMessageType;
  message: any;
}

export enum DiceMessageType {
  OPEN_DIALOG = "OPEN_DIALOG",
  OPEN_ATTACK_DIALOG = "OPEN_ATTACK_DIALOG",
  SELECT_DICES = "SELECT_DICES",
  ROLL_RESULT = "ROLL_RESULT",
  CLOSE_DIALOG = "CLOSE_DIALOG",
}
