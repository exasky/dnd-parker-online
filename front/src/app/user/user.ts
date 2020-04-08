import {Character} from "../adventure/model/character";

export class User {
  id: number;
  username: string;
  role: string;

  // TODO Updated at each level/adventure changes
  currentCharacter: Character;

  // Current jwt token
  token: string;
}

export const ROLE_GM = 'ROLE_GM';
