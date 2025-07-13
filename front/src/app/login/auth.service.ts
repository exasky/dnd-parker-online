import { HttpClient } from "@angular/common/http";
import { computed, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { ROLE_GM, User } from "../user/user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private static API_URL = environment.apiUrl + "/login";

  private currentUserSignal = signal<User>(JSON.parse(localStorage.getItem("currentUser")));

  readonly currentUserValue = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => !!this.currentUserValue());
  readonly isGM = computed(() => this.currentUserSignal()?.role === ROLE_GM);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, password: string) {
    return this.http.post<any>(AuthService.API_URL, { username, password }).pipe(
      map((res) => {
        const user = jwtDecode(res.token) as any; // TODO checks & fix
        user.token = res.token;
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSignal.set(user);
        }

        return user;
      }),
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSignal.set(null);
    this.router.navigateByUrl("/login");
  }
}
