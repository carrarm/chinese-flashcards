import { inject, Injectable, signal } from "@angular/core";
import { Title } from "@angular/platform-browser";

export type NavbarType = "main" | "description";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  public static readonly APP_NAME = "Chinese Flashcards";

  public readonly navbarType = signal<NavbarType>("main");
  public readonly navbarText = signal("");
  public readonly navbarVisible = signal(true);

  private readonly titleService = inject(Title);

  public setTitle(title: string): void {
    this.titleService.setTitle(NavigationService.APP_NAME + " | " + title);
  }

  public resetNavbarText(): void {
    this.setNavbarText(NavigationService.APP_NAME, "main");
  }

  public setNavbarText(text: string, type: NavbarType): void {
    this.navbarType.set(type);
    this.navbarText.set(text);
  }
}
