import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {UserEdit} from "../model/user-edit";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static API_URL = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<UserEdit[]> {
    return this.http.get<UserEdit[]>(UserService.API_URL);
  }

  create(user: UserEdit): Observable<void> {
    return this.http.post<void>(UserService.API_URL, user);
  }

  update(user: UserEdit): Observable<void> {
    return this.http.put<void>(UserService.API_URL + '/' + user.id, user);
  }
}
