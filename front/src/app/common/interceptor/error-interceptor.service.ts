import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
// import {TranslateService} from '@ngx-translate/core';
import {ToasterService} from "../service/toaster.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(/*private translate: TranslateService,*/
              private toasterService: ToasterService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          this.toasterService.error('ERROR.FORBIDDEN');
          return throwError(err);
        } else {
          let errorToThrow = err.error;
          if (err.error && err.error.errors) {
            err.error.errors.forEach(error => {
              // this.toasterService.error(this.translate.instant('ERROR.' + error));
              this.toasterService.error(error);
            });
          } else {
            errorToThrow = err.error.message || err.statusText;
            this.toasterService.error(errorToThrow);
          }
          return throwError(errorToThrow);
        }
      }));
  }
}
