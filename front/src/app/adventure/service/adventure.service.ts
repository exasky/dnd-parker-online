import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Adventure} from "../model/adventure";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {SimpleCampaign} from "../model/campaign";
import {MouseMove} from "../model/adventure-message";

@Injectable({
  providedIn: "root"
})
export class AdventureService {

  private static API_URL = environment.apiUrl + '/adventure';

  constructor(private http: HttpClient) {
  }

  getCampaignsForCurrentUser(): Observable<SimpleCampaign[]> {
    return this.http.get<SimpleCampaign[]>(AdventureService.API_URL + '/campaigns');
  }

  getAdventure(id: number | string): Observable<Adventure> {
    return this.http.get<Adventure>(AdventureService.API_URL + '/' + id);
  }

  update(adventure: Adventure): Observable<Adventure> {
    return this.http.put<Adventure>(AdventureService.API_URL + '/' + adventure.id, adventure);
  }

  playerMouseMove(mouseMove: MouseMove) {
    this.http.post(AdventureService.API_URL + '/mouse-move', mouseMove).subscribe();
  }
}
