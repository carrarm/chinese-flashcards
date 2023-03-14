export type AppTheme = "dark" | "light";

export interface SettingsModel {
  id?: number;
  enableReviewMatching: boolean;
  learnPinyin: boolean;
  pageSize: number;
  wordsPerSession: number;
  theme: AppTheme;
  leitnerBoxes: number;
}

export class Settings implements SettingsModel {
  public id?: number;
  public enableReviewMatching = false;
  public learnPinyin = true;
  public pageSize = 10;
  public wordsPerSession = 10;
  public theme: AppTheme = "dark";
  public leitnerBoxes = 5;

  constructor(settings?: SettingsModel) {
    if (settings) {
      this.id = settings.id;
      this.enableReviewMatching = settings.enableReviewMatching;
      this.learnPinyin = settings.learnPinyin;
      this.pageSize = settings.pageSize;
      this.wordsPerSession = settings.wordsPerSession;
      this.theme = settings.theme;
      this.leitnerBoxes = settings.leitnerBoxes;
    }
  }

  isDarkModeActive(): boolean {
    return this.theme === "dark";
  }
}
