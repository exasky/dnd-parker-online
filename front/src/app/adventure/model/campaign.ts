import {Adventure} from "./adventure";
import {Character, CharacterEquipment} from "./character";

export interface Campaign {
  id?: number;
  name: string;
  adventures: Adventure[];
  drawnItems: CharacterEquipment[];
  characters: Character[];
}

export interface SimpleCampaign {
  id: number;
  name: string;
  currentAdventureId: number;
  currentAdventureName: string;
  currentCharacterDisplayName: string[];
  characters: {id: number, name: string}[];
}
