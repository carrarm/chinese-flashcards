import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NavigationService } from "@core/services/navigation.service";

const importedModules = [CommonModule, MatButtonModule, MatIconModule];

@Component({
  selector: "chf-navbar",
  standalone: true,
  imports: importedModules,
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  @Output() toggleMenu = new EventEmitter<void>();

  public pageTitle$ = this.navigation.getTitle();

  constructor(private navigation: NavigationService) {}
}
