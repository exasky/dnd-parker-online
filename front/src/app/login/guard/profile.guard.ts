import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: "root" })
export class ProfileGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const rolesToCheck = route.data["roles"] as string[];
    if (rolesToCheck.indexOf(this.authService.currentUserValue().role) !== -1) {
      return true;
    } else {
      return this.router.navigate(["/"], { queryParams: { message: "unauthorized" } });
    }
  }
}
