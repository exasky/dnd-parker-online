import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CharacterItem} from "../model/character";

@Injectable({
  providedIn: "root"
})
export class AdventureCardService {

  private static API_URL = environment.apiUrl + '/adventure';

  constructor(private http: HttpClient) {
  }

  drawCard(adventureId, characterId) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card', {adventureId, characterId}).subscribe();
  }

  validateDrawnCard(adventureId, characterItemId, validation) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card-validate', {
      adventureId,
      characterItemId,
      validation
    }).subscribe();
  }

  setChestSpecificCard(adventureId: number, chestSpecificCard: { characterItemId: number; layerItemId: number }) {
    return this.http.post(AdventureCardService.API_URL + '/set-chest-specific-card/' + adventureId, chestSpecificCard).subscribe();
  }

  drawSpecificCard(adventureId: number, cardId: number) {
    return this.http.get<CharacterItem>(AdventureCardService.API_URL + '/draw-specific-card/' + adventureId + '/' + cardId).subscribe();
  }
}
