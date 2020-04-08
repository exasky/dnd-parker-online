import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Character} from "../model/character";

@Injectable({
  providedIn: "root"
})
export class CharacterService {
  getCharacter(id: number, adventureId: number): Observable<Character> {
    return of(null);
  }
}
