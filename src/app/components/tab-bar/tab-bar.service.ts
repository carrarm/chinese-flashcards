import { Injectable } from "@angular/core";
import {
  IconDefinition,
  faBook,
  faCirclePlay,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject } from "rxjs";

type Tab = { icon: IconDefinition; label: string };
export type RouterTab = Tab & { route: string };
export type ActionTab = Tab & { action: () => void };
export type TabType = "router" | "action";
export type RouterTabBar = { tabs: RouterTab[]; type: "router" };
export type ActionTabBar = { tabs: ActionTab[]; type: "action" };

@Injectable({
  providedIn: "root",
})
export class TabBarService {
  private readonly rootTabs: RouterTab[] = [
    { icon: faCirclePlay, label: "Start session", route: "/sessions" },
    { icon: faBook, label: "Browse cards", route: "/collections" },
    { icon: faGear, label: "Settings", route: "/settings" },
  ];

  public readonly tabs = new BehaviorSubject<RouterTabBar | ActionTabBar>({
    type: "router",
    tabs: this.rootTabs,
  });

  resetTabBar(): void {
    this.setRoutes(this.rootTabs);
  }

  setRoutes(tabs: RouterTab[]): void {
    this.tabs.next({ type: "router", tabs });
  }

  setActions(tabs: ActionTab[]): void {
    this.tabs.next({ type: "action", tabs });
  }
}
