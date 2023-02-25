import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SettingsService } from './core/services/settings.service';

@Component({
  selector: 'chf-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatDrawer) drawer?: MatDrawer;

  public isDarkMode = true;

  constructor(router: Router, settingsService: SettingsService) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer?.close();
      });

    settingsService
      .isDarkMode()
      .subscribe((darkMode) => (this.isDarkMode = darkMode));
  }
}
