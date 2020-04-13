import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DiceService {
  private static API_URL = environment.apiUrl + '/dice';

  constructor(private http: HttpClient) {
  }

  openDiceDialog(): void {
    this.http.get<void>(DiceService.API_URL + '/open').subscribe(() => {});
  }

  selectDices(diceIds: number[]) {
    this.http.post(DiceService.API_URL + '/select-dices', {ids: diceIds}).subscribe(() => {});
  }

  rollDices(diceIds: number[]) {
    // Is it really useful to send dice ids instead of the number of thrown dices ?
    // Now no, but if we want to generate results from backend, it can be nice to have the ids !
    this.http.post(DiceService.API_URL + '/roll-dices', {ids: diceIds}).subscribe(() => {});
  }
}
