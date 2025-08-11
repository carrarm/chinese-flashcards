import { isDevMode, NgModule, inject, provideAppInitializer } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule, SwUpdate } from "@angular/service-worker";

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { checkForUpdates } from "@core/pwa-updates";
import { NgCircleProgressModule } from "ng-circle-progress";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { TabBarComponent } from "./components/tab-bar/tab-bar.component";
import { CollectionPageModule } from "./pages/collection/collection-page.module";
import { LearnPageModule } from "./pages/learn/learn-page.module";
import { SettingsModule } from "./pages/settings/settings.module";

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CollectionPageModule,
    LearnPageModule,
    NavbarComponent,
    NgCircleProgressModule.forRoot(),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
    SettingsModule,
    TabBarComponent,
  ],
  providers: [
    provideAppInitializer(() => {
      const initializerFn = checkForUpdates(inject(SwUpdate), inject(MatSnackBar));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
