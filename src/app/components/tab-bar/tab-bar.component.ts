import { Component, effect, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActionTab, RouterTab, TabBarService } from "./tab-bar.service";

@Component({
  selector: "chf-tab-bar",
  imports: [FontAwesomeModule, RouterModule],
  templateUrl: "./tab-bar.component.html",
  styleUrls: ["./tab-bar.component.scss"],
})
export class TabBarComponent {
  private readonly tabBarService = inject(TabBarService);

  protected actions: ActionTab[] = [];
  protected routes: RouterTab[] = [];

  constructor() {
    effect(() => {
      const tabBar = this.tabBarService.tabs();
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
