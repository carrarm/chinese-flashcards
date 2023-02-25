import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatSidenavModule } from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollectionPageModule } from './pages/collection/collection-page.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SettingsModule } from './pages/settings/settings.module';
import { LearnPageModule } from './pages/learn/learn-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CollectionPageModule,
    LearnPageModule,
    MatSidenavModule,
    NavbarComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    SettingsModule,
    SidenavComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
