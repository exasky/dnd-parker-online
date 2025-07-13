import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

import { AuthService } from "../auth.service";

export const authGuard: CanActivateFn = (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  if (auth.isLoggedIn()) return true;

  const router = inject(Router);
  return router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
};
