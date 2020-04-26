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

  drawCard(adventureId, characterId, characterEquipmentId?) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card', {adventureId, characterId, characterItemId: characterEquipmentId}).subscribe();
  }

  validateDrawnCard(adventureId, characterItemId, validation) {
    return this.http.post(AdventureCardService.API_URL + '/draw-card-validate', {
      adventureId,
      characterItemId,
      validation
    }).subscribe();
  }
}
