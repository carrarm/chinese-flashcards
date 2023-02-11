export type AppTheme = 'dark' | 'light';

export interface SettingsModel {
  id?: number;
  learnPinyin: boolean;
  pageSize: number;
  wordsPerSession: number;
  theme: AppTheme;
}

export class Settings implements SettingsModel {
  public id?: number;
  public learnPinyin = true;
  public pageSize = 10;
  public wordsPerSession = 10;
  public theme: AppTheme = 'dark';

  constructor(settings?: SettingsModel) {
    if (settings) {
      this.id = settings.id;
      this.learnPinyin = settings.learnPinyin;
      this.pageSize = settings.pageSize;
      this.wordsPerSession = settings.wordsPerSession;
      this.theme = settings.theme;
    }
  }

  isDarkModeActive(): boolean {
    return this.theme === 'dark';
  }
}
