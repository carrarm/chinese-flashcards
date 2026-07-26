export type AppTheme = "dark" | "light";
export type CardReviewType = "oldest" | "newest";

export interface SettingsModel {
  id?: number;
  enableReviewMatching: boolean;
  pageSize: number;
  wordsPerSession: number;
  theme: AppTheme;
  leitnerBoxes: number;
  resetCardProgress: boolean;
  cardSelectionType: CardReviewType;
}

export class Settings implements SettingsModel {
  public id?: number;
  public enableReviewMatching = false;
  public pageSize = 10;
  public wordsPerSession = 10;
  public theme: AppTheme = "dark";
  public leitnerBoxes = 5;
  public resetCardProgress = true;
  public cardSelectionType: CardReviewType = "newest";

  constructor(settings?: SettingsModel) {
    if (settings) {
      this.id = settings.id;
      this.enableReviewMatching = settings.enableReviewMatching;
      this.pageSize = settings.pageSize;
      this.wordsPerSession = settings.wordsPerSession;
      this.theme = settings.theme;
      this.leitnerBoxes = settings.leitnerBoxes;
      this.resetCardProgress = settings.resetCardProgress;
      this.cardSelectionType = settings.cardSelectionType;
    }
  }

  public isDarkModeActive(): boolean {
    return this.theme === "dark";
  }
}
