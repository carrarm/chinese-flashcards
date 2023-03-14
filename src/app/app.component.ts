import { Component, ViewChild } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { SettingsService } from "./core/services/settings.service";

@Component({
  selector: "chf-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  @ViewChild(MatDrawer) drawer?: MatDrawer;

  public isDarkMode = true;

  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    router: Router,
    settingsService: SettingsService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer?.close();
      });

    settingsService.isDarkMode().subscribe((darkMode) => (this.isDarkMode = darkMode));

    this.registerIcons();
  }

  private registerIcons(): void {
    this.addSvgIcon("face-sob", "face-sad-cry-solid");
    this.addSvgIcon("face-laugh", "face-laugh-beam-solid");
    this.addSvgIcon("face-smile", "face-smile-solid");
  }

  private addSvgIcon(name: string, icon: string): void {
    this.iconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/" + icon + ".svg")
    );
  }
}
