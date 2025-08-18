import { Component, inject, OnInit, viewChild } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { filter } from "rxjs";

import { registerIcons } from "@core/font-awesome.config";
import { SettingsService } from "@core/services/settings.service";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { TabBarComponent } from "@components/tab-bar/tab-bar.component";

@Component({
  selector: "chf-root",
  imports: [NavbarComponent, RouterOutlet, TabBarComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  protected readonly drawer = viewChild(MatDrawer);

  private readonly domSanitizer = inject(DomSanitizer);
  private readonly faLibrary = inject(FaIconLibrary);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);

  protected isDarkMode = true;

  public ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer()?.close();
      });

    this.settingsService
      .isDarkMode()
      .subscribe((darkMode) => (this.isDarkMode = darkMode));

    registerIcons(this.faLibrary, this.iconRegistry, this.domSanitizer);
  }
}
