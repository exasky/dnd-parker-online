import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Adventure, LayerItem} from "../model/adventure";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SimpleCampaign} from "../model/campaign";
import {MouseMove} from "../model/adventure-message";
import {Character, CharacterEquipment, CharacterTemplate} from "../model/character";

@Injectable({
  providedIn: "root"
})
export class AdventureService {

  private static API_URL = environment.apiUrl + '/adventure';

  constructor(private http: HttpClient) {
  }

  getCharacterTemplates(): Observable<CharacterTemplate[]> {
    return this.http.get<CharacterTemplate[]>(AdventureService.API_URL + '/character-templates');
  }

  getCampaignsForCurrentUser(): Observable<SimpleCampaign[]> {
    return this.http.get<SimpleCampaign[]>(AdventureService.API_URL + '/campaigns');
  }

  getAdventure(id: number | string): Observable<Adventure> {
    return this.http.get<Adventure>(AdventureService.API_URL + '/' + id);
  }

  playerMouseMove(adventureId, mouseMove: MouseMove) {
    return this.http.post(AdventureService.API_URL + '/mouse-move/' + adventureId, mouseMove);
  }

  addLayerItem(adventureId, layerItem: LayerItem) {
    this.http.post(AdventureService.API_URL + '/add-layer-item/' + adventureId, layerItem).subscribe();
  }

  updateLayerItem(adventureId, layerItem: LayerItem) {
    this.http.put(AdventureService.API_URL + '/update-layer-item/' + adventureId, layerItem).subscribe();
  }

  deleteLayerItem(adventureId, layerItem: LayerItem) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: layerItem
    };
    this.http.delete(AdventureService.API_URL + '/delete-layer-item/' + adventureId, options).subscribe();
  }

  updateCharacter(adventureId, character: Character) {
    this.http.post(AdventureService.API_URL + '/update-character/' + adventureId + '/' + character.id, character).subscribe();
  }

  selectMonster(adventureId, layerItemId) {
    this.http.get(AdventureService.API_URL + '/select-monster/' + adventureId + '/' + layerItemId).subscribe();
  }

  askNextTurn(adventureId) {
    this.http.get(AdventureService.API_URL + '/ask-next-turn/' + adventureId).subscribe();
  }

  validateNextTurn(adventureId, validation: boolean) {
    this.http.post(AdventureService.API_URL + '/validate-next-turn/' + adventureId, {validation}).subscribe();
  }

  askTrade(adventureId, trade: { from: number; to: number }) {
    this.http.post(AdventureService.API_URL + '/ask-trade/' + adventureId, trade).subscribe();
  }

  selectTradeEquipment(adventureId: number, equipment: { characterEquipment: CharacterEquipment; isEquipment }, isFrom: boolean) {
    this.http.post(AdventureService.API_URL + '/select-trade/' + adventureId, {isFrom, ...equipment}).subscribe();
  }

  validateTrade(adventureId: number, trade) {
    this.http.post(AdventureService.API_URL + '/validate-trade/' + adventureId, trade).subscribe();
  }

  askSwitch(adventureId: number, characterId: number) {
    this.http.get(AdventureService.API_URL + '/ask-switch/' + adventureId + '/' + characterId).subscribe();
  }

  selectSwitch(adventureId: number, equipment: {equipmentId: number, isEquipment: boolean}) {
    this.http.post(AdventureService.API_URL + '/select-switch/' + adventureId, equipment).subscribe();
  }

  validateSwitch(adventureId: number, switchEq: {characterId: number, characterEquippedItemId: number, characterBackpackItemId: number}) {
    this.http.post(AdventureService.API_URL + '/validate-switch/' + adventureId, switchEq).subscribe();
  }
}
