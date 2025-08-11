import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActionTab, RouterTab, TabBarService } from "./tab-bar.service";

@Component({
  selector: "chf-tab-bar",
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: "./tab-bar.component.html",
  styleUrls: ["./tab-bar.component.scss"],
})
export class TabBarComponent {
  public actions: ActionTab[] = [];
  public routes: RouterTab[] = [];

  constructor(tabBarService: TabBarService) {
    tabBarService.tabs.asObservable().subscribe((tabBar) => {
      if (tabBar.type === "action") {
        this.actions = tabBar.tabs;
        this.routes = [];
      } else {
        this.routes = tabBar.tabs;
        this.actions = [];
      }
    });
  }
}
