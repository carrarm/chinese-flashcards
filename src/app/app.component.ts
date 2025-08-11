import { Component, inject, OnInit, viewChild } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { filter } from "rxjs";
import { SettingsService } from "./core/services/settings.service";
import { registerIcons } from "@core/font-awesome.config";

@Component({
  selector: "chf-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: false,
})
export class AppComponent implements OnInit{
  protected readonly drawer = viewChild.required(MatDrawer);

  private readonly domSanitizer = inject(DomSanitizer);
  private readonly faLibrary = inject(FaIconLibrary);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly router = inject(Router,);
  private readonly settingsService = inject(SettingsService);

  protected isDarkMode = true;

  public ngOnInit(): void {
      this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.drawer().close();
      });

    this.settingsService.isDarkMode().subscribe((darkMode) => (this.isDarkMode = darkMode));

    registerIcons(this.faLibrary, this.iconRegistry, this.domSanitizer);
  }
}
