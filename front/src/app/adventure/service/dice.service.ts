import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Dice} from "../model/dice";
import {Observable} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DiceService {
  private static API_URL = environment.apiUrl + '/dice';

  constructor(private http: HttpClient) {
  }

  getAllDices(): Observable<Dice[]> {
    return this.http.get<Dice[]>(DiceService.API_URL);
  }

  openDiceDialog(adventureId): void {
    this.http.get(DiceService.API_URL + '/open/' + adventureId).subscribe();
  }

  openDiceAttackDialog(adventureId, fromAttackId, toAttackId, isMonsterAttack: boolean, isMonsterAttacked: boolean, fromAttackWeaponId?) {
    this.http.post(DiceService.API_URL + '/attack/' + adventureId,
      {fromAttackId, fromAttackWeaponId, toAttackId, isMonsterAttack, isMonsterAttacked}).subscribe();
  }

  selectDices(adventureId, diceIds: number[]) {
    this.http.post(DiceService.API_URL + '/select-dices/' + adventureId, {ids: diceIds}).subscribe();
  }

  rollDices(adventureId, diceIds: number[]) {
    // Is it really useful to send dice ids instead of the number of thrown dices ?
    // Not now, but if we want to generate results from backend, it can be nice to have the ids !
    this.http.post(DiceService.API_URL + '/roll-dices/' + adventureId, {ids: diceIds}).subscribe();
  }

  closeDialog(adventureId: string) {
    this.http.get(DiceService.API_URL + '/close/' + adventureId).subscribe();
  }
}
