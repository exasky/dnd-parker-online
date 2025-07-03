import { ApplicationRef, enableProdMode } from "@angular/core";

import { enableDebugTools } from "@angular/platform-browser";
import { environment } from "./environments/environment";

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

if (environment.production) {
  enableProdMode();
}

if (environment.perf) {
  bootstrapApplication(AppComponent, appConfig)
    .then((moduleRef) => {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];
      // allows to run `ng.profiler.timeChangeDetection();`
      enableDebugTools(componentRef);
    })
    .catch((err) => console.error(err));
} else {
  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
}
