import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Campaign, SimpleCampaign} from "../model/campaign";
import {AlertMessage} from "../model/alert-message";

@Injectable({
  providedIn: "root"
})
export class CampaignService {
  private static API_URL = environment.apiUrl + '/campaign';

  constructor(private http: HttpClient) {
  }

  getAllCampaigns(): Observable<SimpleCampaign[]> {
    return this.http.get<SimpleCampaign[]>(CampaignService.API_URL);
  }

  getCampaign(id: number | string): Observable<Campaign> {
    return this.http.get<Campaign>(CampaignService.API_URL + '/' + id);
  }

  copyFrom(id: number | string): Observable<Campaign> {
    return this.http.get<Campaign>(CampaignService.API_URL + '/copy/' + id);
  }

  saveCampaign(campaign: Campaign): Observable<Campaign> {
    return campaign.id
      ? this.http.put<Campaign>(CampaignService.API_URL + '/' + campaign.id, campaign)
      : this.http.post<Campaign>(CampaignService.API_URL, campaign);
  }

  deleteCampaign(id: number | string): Observable<void> {
    return this.http.delete<void>(CampaignService.API_URL + '/' + id);
  }
}
