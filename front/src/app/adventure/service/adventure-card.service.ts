import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class AdventureCardService {

  private static API_URL = environment.apiUrl + '/adventure';

  constructor(private http: HttpClient) {
  }

  drawCard(adventureId, characterId, chestItemId, characterEquipmentId?) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card', {adventureId, characterId, chestItemId, characterItemId: characterEquipmentId}).subscribe();
  }

  drawCardSetEmplacement(adventureId, isEquipment) {
    return this.http.get(AdventureCardService.API_URL + '/draw-card/' + adventureId + '/' + isEquipment).subscribe();
  }

  validateDrawnCard(adventureId, characterId, characterItemId, chestItemId, equipToEquipment, validation) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card-validate', {
      adventureId,
      characterId,
      characterItemId,
      chestItemId,
      equipToEquipment,
      validation
    }).subscribe();
  }
}
