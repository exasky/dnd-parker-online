import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Adventure, LayerItem} from "../model/adventure";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SimpleCampaign} from "../model/campaign";
import {MouseMove} from "../model/adventure-message";
import {CharacterItem, CharacterTemplate} from "../model/character";

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

  drawCard(adventureId: number | string) {
    return this.http.get<CharacterItem>(AdventureService.API_URL + '/draw-card/' + adventureId).subscribe();
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

  deleteLayerItem(adventureId, layerItemId) {
    this.http.delete(AdventureService.API_URL + '/delete-layer-item/' + adventureId + '/' + layerItemId).subscribe();
  }

  selectCharacter(adventureId, characterId) {
    this.http.get(AdventureService.API_URL + '/select-character/' + adventureId + '/' + characterId).subscribe();
  }

  showTrap(adventureId, trapLayerItemId) {
    return this.http.get(AdventureService.API_URL + '/show-trap/' + adventureId + '/' + trapLayerItemId).subscribe();
  }
}
