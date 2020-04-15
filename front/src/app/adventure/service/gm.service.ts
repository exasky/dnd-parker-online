import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LayerElement} from "../model/adventure";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CharacterItem} from "../model/character";
import {Campaign, SimpleCampaign} from "../model/campaign";
import {Dice} from "../model/dice";
import {AlertMessage} from "../model/alert-message";

@Injectable({
  providedIn: "root"
})
export class GmService {
  private static API_URL = environment.apiUrl + '/game-master';

  constructor(private http: HttpClient) {
  }

  getAddableElements(): Observable<LayerElement[]> {
    return this.http.get<LayerElement[]>(GmService.API_URL + '/addable-elements');
  }

  getAllCharacterItems(): Observable<CharacterItem[]> {
    return this.http.get<CharacterItem[]>(GmService.API_URL + '/character-items');
  }

  getAllDices(): Observable<Dice[]> {
    return this.http.get<Dice[]>(GmService.API_URL + '/dices');
  }

  getAllCampaigns(): Observable<SimpleCampaign[]> {
    return this.http.get<SimpleCampaign[]>(GmService.API_URL + '/campaign');
  }

  getCampaign(id: number | string): Observable<Campaign> {
    return this.http.get<Campaign>(GmService.API_URL + '/campaign/' + id);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    return campaign.id
      ? this.http.put<Campaign>(GmService.API_URL + '/campaign/' + campaign.id, campaign)
      : this.http.post<Campaign>(GmService.API_URL + '/campaign', campaign);
  }

  deleteCampaign(id: number | string): Observable<void> {
    return this.http.delete<void>(GmService.API_URL + '/campaign/' + id);
  }

  previousAdventure(adventureId: number | string) {
    return this.http.get(GmService.API_URL + '/previous-adventure/' + adventureId).subscribe(() => {});
  }

  nextAdventure(adventureId: number | string) {
    return this.http.get(GmService.API_URL + '/next-adventure/' + adventureId).subscribe(() => {});
  }

  sendAlert(adventureId: number | string, alertMessage: AlertMessage) {
    return this.http.post(GmService.API_URL + '/send-alert/' + adventureId, alertMessage).subscribe(() => {});
  }
}
