import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Database } from '../db/database.model';
import { Settings } from '../model/settings.model';
import { DatabaseService } from '../db/database.service';

const THEME_STORAGE_KEY = 'THEME';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private database: Database;
  private darkModeActive$ = new BehaviorSubject<boolean>(
    (localStorage.getItem(THEME_STORAGE_KEY) ?? 'dark') === 'dark'
  );

  constructor(databaseService: DatabaseService) {
    this.database = databaseService.database;
  }

  isDarkMode(): Observable<boolean> {
    return this.darkModeActive$.asObservable();
  }

  getSettings(): Promise<Settings> {
    return this.database.settings.toArray().then(async (settingCollection) => {
      let settings = new Settings();
      if (settingCollection.length === 0) {
        settings.id = await this.database.settings.add(new Settings(settings));
      } else {
        settings = new Settings(settingCollection[0]);
      }
      return settings;
    });
  }

  updateSettings(settings: Settings): void {
    this.darkModeActive$.next(settings.isDarkModeActive());
    // Save to the localStorage so that the background can be immediately set to
    // the correct theme on start
    localStorage.setItem(THEME_STORAGE_KEY, settings.theme);
    this.database.settings.put(settings);
  }
}
