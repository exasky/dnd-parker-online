import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Adventure} from "../model/adventure";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class AdventureService {

  private static API_URL = environment.apiUrl + '/adventure';

  constructor(private http: HttpClient) {
  }

  getAdventures(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ id: number, name: string }[]>(AdventureService.API_URL);
  }

  getAdventure(id: number | string): Observable<Adventure> {
    return this.http.get<Adventure>(AdventureService.API_URL + '/' + id);
  }
}
