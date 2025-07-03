import { Character } from "../adventure/model/character";

export class User {
  id: number;
  username: string;
  role: string;

  characters: Character[];

  // Current jwt token
  token: string;
}

export const ROLE_GM = "ROLE_GM";
