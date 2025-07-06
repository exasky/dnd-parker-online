import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth.service";

export const profileGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const rolesToCheck = route.data["roles"] as string[];
  return (
    rolesToCheck.indexOf(auth.currentUserValue().role) !== -1 ||
    router.navigate(["/"], { queryParams: { message: "unauthorized" } })
  );
};
