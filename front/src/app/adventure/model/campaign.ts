import {Adventure} from "./adventure";
import {Character, CharacterItem} from "./character";

export interface Campaign {
  id?: number;
  name: string;
  adventures: Adventure[];
  drawnItems: CharacterItem[];
  characters: Character[];
}

export interface SimpleCampaign {
  id: number;
  name: string;
  currentAdventureId: number;
  currentAdventureName: string;
  characters: {id: number, name: string}[];
}
