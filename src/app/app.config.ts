import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
} from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { checkForUpdates } from "@core/pwa-updates";
import { provideServiceWorker, SwUpdate } from "@angular/service-worker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgCircleProgressModule } from "ng-circle-progress";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    // For legacy NgModules
    importProvidersFrom(NgCircleProgressModule.forRoot()),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000",
    }),
    provideAppInitializer(() => {
      const initializerFn = checkForUpdates(inject(SwUpdate), inject(MatSnackBar));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
  ],
};
