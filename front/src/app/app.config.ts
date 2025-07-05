import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { jwtInterceptor } from "./login/interceptor/jwt.interceptor";
import { forbiddenInterceptor } from "./login/interceptor/forbidden.interceptor";
import { errorInterceptor } from "./common/interceptor/error-interceptor.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";

export function translateLoader(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, forbiddenInterceptor, errorInterceptor])),
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoader,
          deps: [HttpClient],
        },
      }),
    ]),
    provideToastr({
      timeOut: 5000,
      positionClass: "toast-bottom-right",
    }),
    provideAnimations(),
  ],
};
