import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

export function forbiddenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((err) => {
      if (err.status === 401 && router.url !== "/login") {
        authService.logout();
      }

      const error = err.error.message || err.statusText;
      return throwError(() => error);
    }),
  );
}
