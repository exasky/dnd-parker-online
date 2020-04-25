import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Adventure, LayerItem} from "../model/adventure";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SimpleCampaign} from "../model/campaign";
import {MouseMove} from "../model/adventure-message";
import {Character, CharacterTemplate} from "../model/character";

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
    this.http.post(AdventureService.API_URL + '/mouse-move/' + adventureId, mouseMove).subscribe();
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

  selectCharacter(adventureId, characterId) {
    this.http.get(AdventureService.API_URL + '/select-character/' + adventureId + '/' + characterId).subscribe();
  }

  updateCharacter(adventureId, character: Character) {
    this.http.post(AdventureService.API_URL + '/update-character/' + adventureId + '/' + character.id, character).subscribe();
  }

  selectMonster(adventureId, layerItemId) {
    this.http.get(AdventureService.API_URL + '/select-monster/' + adventureId + '/' + layerItemId).subscribe();
  }
}
