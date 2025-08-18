import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Database } from "../db/database.model";
import { Settings } from "../model/settings.model";
import { DatabaseService } from "../db/database.service";

const THEME_STORAGE_KEY = "THEME";

@Injectable({ providedIn: "root" })
export class SettingsService {
  private readonly databaseService = inject(DatabaseService);

  private readonly database: Database = this.databaseService.database;

  private darkModeActive$ = new BehaviorSubject<boolean>(
    (localStorage.getItem(THEME_STORAGE_KEY) ?? "dark") === "dark"
  );

  public isDarkMode(): Observable<boolean> {
    return this.darkModeActive$.asObservable();
  }

  public async getSettings(): Promise<Settings> {
    const settingCollection = await this.database.settings.toArray();
    let settings = new Settings();
    if (settingCollection.length === 0) {
      settings.id = await this.database.settings.add(new Settings(settings));
    } else {
      settings = new Settings(settingCollection[0]);
    }
    return settings;
  }

  public updateSettings(settings: Settings): void {
    this.darkModeActive$.next(settings.isDarkModeActive());
    // Save to the localStorage so that the background can be immediately set to
    // the correct theme on start
    localStorage.setItem(THEME_STORAGE_KEY, settings.theme);
    this.database.settings.put(settings);
  }
}
