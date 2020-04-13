import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {ROLE_GM, User} from "../user/user";
import {map} from "rxjs/operators";
import * as jwt_decode from 'jwt-decode';
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private static API_URL = environment.apiUrl + '/login';

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
              private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isGM(): boolean {
    return this.currentUserValue.role === ROLE_GM;
  }

  login(username: string, password: string) {
    return this.http.post<any>(AuthService.API_URL, { username, password })
      .pipe(map(res => {
        const user = jwt_decode(res.token);
        user.token = res.token;
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login');
  }
}
