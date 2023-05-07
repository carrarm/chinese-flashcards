import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faBook, faCirclePlay, faGear } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "chf-tab-bar",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: "./tab-bar.component.html",
  styleUrls: ["./tab-bar.component.scss"],
})
export class TabBarComponent {
  public tabs = [
    { icon: faCirclePlay, label: "Start session", route: "/sessions" },
    { icon: faBook, label: "Browser cards", route: "/collections" },
    { icon: faGear, label: "Settings", route: "/settings" },
  ];
}
