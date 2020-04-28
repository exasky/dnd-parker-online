import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Initiative, LayerElement} from "../model/adventure";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CharacterEquipment} from "../model/character";
import {AlertMessage} from "../model/alert-message";
import {MonsterTemplate} from "../model/monster";
import {MonsterItem} from "../model/item";

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

  getAllCharacterItems(): Observable<CharacterEquipment[]> {
    return this.http.get<CharacterEquipment[]>(GmService.API_URL + '/character-items');
  }

  getMonsterTemplates(): Observable<MonsterTemplate[]> {
    return this.http.get<MonsterTemplate[]>(GmService.API_URL + '/monster-templates')
  }

  rollInitiative(adventureId: number | string) {
    return this.http.get(GmService.API_URL + '/initiative/' + adventureId).subscribe();
  }

  updateInitiatives(adventureId: number | string, initiatives: Initiative[]) {
    return this.http.post(GmService.API_URL + '/initiative/' + adventureId, initiatives).subscribe();
  }

  previousAdventure(adventureId: number | string) {
    return this.http.get(GmService.API_URL + '/previous-adventure/' + adventureId).subscribe();
  }

  nextAdventure(adventureId: number | string) {
    return this.http.get(GmService.API_URL + '/next-adventure/' + adventureId).subscribe();
  }

  sendAlert(adventureId: number | string, alertMessage: AlertMessage) {
    return this.http.post(GmService.API_URL + '/send-alert/' + adventureId, alertMessage).subscribe();
  }

  playSound(adventureId: number, audioFile: string) {
    return this.http.get(GmService.API_URL + '/play-sound/' + adventureId + '/' + audioFile).subscribe();
  }

  playAmbientSound(adventureId: number, audioFile: string) {
    return this.http.get(GmService.API_URL + '/play-ambient-sound/' + adventureId + '/' + audioFile).subscribe();
  }

  updateMonster(adventureId: number, monster: MonsterItem) {
    return this.http.post(GmService.API_URL + '/update-monster/' + adventureId + '/' + monster.id, monster).subscribe();
  }

  closeDialog(adventureId: number) {
    return this.http.get(GmService.API_URL + '/close/' + adventureId).subscribe();
  }
}
