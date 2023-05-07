import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NavbarType, NavigationService } from "@core/services/navigation.service";
import { Observable, of } from "rxjs";

const importedModules = [CommonModule, MatButtonModule, MatIconModule];

@Component({
  selector: "chf-navbar",
  standalone: true,
  imports: importedModules,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  public navbarType$: Observable<NavbarType> = of();
  public navbarText$: Observable<string> = of();

  constructor(navigation: NavigationService) {
    this.navbarType$ = navigation.navbarType.asObservable();
    this.navbarText$ = navigation.navbarText.asObservable();
  }
}
