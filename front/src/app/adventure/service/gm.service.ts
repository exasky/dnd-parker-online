import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {LayerElement} from "../model/adventure";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CharacterItem} from "../model/character";
import {Campaign, SimpleCampaign} from "../model/campaign";

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
}
