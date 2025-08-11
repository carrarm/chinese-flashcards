import { Component, inject } from "@angular/core";
import {  NavigationService } from "@core/services/navigation.service";

@Component({
  selector: "chf-navbar",
  imports: [],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  protected readonly navigation = inject(NavigationService);
}
