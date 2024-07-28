import { Component, ViewChild } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatDrawer } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import {
  faAdd,
  faArrowRight,
  faBox,
  faBoxOpen,
  faCheck,
  faCheckCircle,
  faCheckToSlot,
  faChevronLeft,
  faChevronRight,
  faCircleXmark,
  faClose,
  faEdit,
  faMagnifyingGlass,
  faRotateLeft,
  faShareFromSquare,
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
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
    private domSanitizer: DomSanitizer,
    private faLibrary: FaIconLibrary,
    private iconRegistry: MatIconRegistry,
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

    // Close / Cancel / Forget it
    this.faLibrary.addIcons(faClose);
    // Delete
    this.faLibrary.addIcons(faTrash);
    // Edit
    this.faLibrary.addIcons(faEdit);
    // Reset
    this.faLibrary.addIcons(faRotateLeft);
    // Share / Move
    this.faLibrary.addIcons(faShareFromSquare);
    // Go back, Go to, Go next
    this.faLibrary.addIcons(faChevronLeft, faChevronRight, faArrowRight);
    // Search
    this.faLibrary.addIcons(faMagnifyingGlass);
    // New element
    this.faLibrary.addIcons(faAdd);
    // Save / Validate
    this.faLibrary.addIcons(faCheck);
    // Archive, unarchive
    this.faLibrary.addIcons(faBox, faBoxOpen);
    // Card validation, card success / error
    this.faLibrary.addIcons(faCheckToSlot, faCheckCircle, faCircleXmark);
    // Duplicate warning
    this.faLibrary.addIcons(faTriangleExclamation);
  }

  private addSvgIcon(name: string, icon: string): void {
    this.iconRegistry.addSvgIcon(
      name,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/" + icon + ".svg")
    );
  }
}
