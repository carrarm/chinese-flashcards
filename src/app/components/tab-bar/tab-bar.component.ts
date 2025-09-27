import { Component, computed, inject } from "@angular/core";
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

  protected readonly actions = computed(() => {
    const tabBar = this.tabBarService.tabs();
    return tabBar.type === "action" ? tabBar.tabs : [];
  });
  protected readonly routes = computed(() => {
    const tabBar = this.tabBarService.tabs();
    return tabBar.type === "action" ? [] : tabBar.tabs;
  });
}
