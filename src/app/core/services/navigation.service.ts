import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";

export type NavbarType = "main" | "description";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  public static readonly APP_NAME = "Chinese Flashcards";
  public readonly navbarType = new BehaviorSubject<NavbarType>("main");
  public readonly navbarText = new BehaviorSubject<string>("");

  constructor(private titleService: Title) {}

  setTitle(title: string): void {
    this.titleService.setTitle(NavigationService.APP_NAME + " | " + title);
  }

  resetNavbarText(): void {
    this.setNavbarText(NavigationService.APP_NAME, "main");
  }

  setNavbarText(text: string, type: NavbarType): void {
    this.navbarType.next(type);
    this.navbarText.next(text);
  }
}
