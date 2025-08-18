import { inject, Injectable, signal } from "@angular/core";
import { Card } from "../model/card.model";
import { CollectionService } from "./collection.service";
import { SettingsService } from "./settings.service";

type SessionType = "review" | "learn";

@Injectable({
  providedIn: "root",
})
export class LearningSessionService {
  public readonly currentSession = signal<Card[]>([]);
  public readonly sessionType = signal<SessionType>("learn");

  private readonly collectionService = inject(CollectionService);
  private readonly settingsService = inject(SettingsService);

  public async createLearningSession(collection?: number): Promise<Card[]> {
    const cards = await this.collectionService
      .getUnknownCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .toArray();

    this.sessionType.set("learn");

    return cards.map((card) => new Card(card));
  }

  public async createReviewSession(collection?: number): Promise<Card[]> {
    const settings = await this.settingsService.getSettings();
    const cards = await this.collectionService
      .getReviewCardRequest(collection)
      .sortBy("leitnerBox");

    if (settings.cardSelectionType === "oldest") {
      cards.reverse();
    }

    this.sessionType.set("review");

    return cards.slice(0, settings.wordsPerSession).map((card) => new Card(card));
  }

  public isLearningSession(): boolean {
    return this.sessionType() === "learn";
  }

  private async getWordsPerSession(): Promise<number> {
    const settings = await this.settingsService.getSettings();
    return settings.wordsPerSession;
  }
}
