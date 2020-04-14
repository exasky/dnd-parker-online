import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Adventure, LayerItem} from "../model/adventure";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SimpleCampaign} from "../model/campaign";
import {MouseMove} from "../model/adventure-message";
import {CharacterTemplate} from "../model/character";

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

  playerMouseMove(mouseMove: MouseMove) {
    this.http.post(AdventureService.API_URL + '/mouse-move', mouseMove).subscribe();
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
}
