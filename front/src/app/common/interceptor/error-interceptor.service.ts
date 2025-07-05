import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
// import {TranslateService} from '@ngx-translate/core';
import { ToasterService } from "../service/toaster.service";

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const toasterService = inject(ToasterService);
  return next(request).pipe(
    catchError((err) => {
      if (err.status === 401 || err.status === 403) {
        toasterService.error("ERROR.FORBIDDEN");
        return throwError(() => err);
      } else if (err.status >= 400) {
        let errorToThrow = err.error;
        if (err.error && err.error.errors) {
          err.error.errors.forEach((error) => {
            // this.toasterService.error(this.translate.instant('ERROR.' + error));
            toasterService.error(error);
          });
        } else {
          errorToThrow = err.error.message || err.statusText;
          toasterService.error(errorToThrow);
        }
        return EMPTY;
      } else {
        return EMPTY;
      }
    }),
  );
}
