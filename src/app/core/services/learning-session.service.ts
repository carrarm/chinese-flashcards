import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Card } from "../model/card.model";
import { CollectionService } from "./collection.service";
import { SettingsService } from "./settings.service";

type SessionType = "review" | "learn";

@Injectable({
  providedIn: "root",
})
export class LearningSessionService {
  public readonly currentSession = new BehaviorSubject<Card[]>([]);
  public readonly sessionType = new BehaviorSubject<SessionType>("learn");

  constructor(
    private collectionService: CollectionService,
    private settingsService: SettingsService
  ) {}

  async createLearningSession(collection?: number): Promise<Card[]> {
    const cards = await this.collectionService
      .getUnknownCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .toArray();

    this.sessionType.next("learn");

    return cards.map((card) => new Card(card));
  }

  async createReviewSession(collection?: number): Promise<Card[]> {
    const cards = await this.collectionService
      .getReviewCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .reverse()
      .sortBy("leitnerBox");

    this.sessionType.next("review");

    return cards.map((card) => new Card(card));
  }

  public isLearningSession(): boolean {
    return this.sessionType.getValue() === "learn";
  }

  private getWordsPerSession(): Promise<number> {
    return this.settingsService
      .getSettings()
      .then((settings) => settings.wordsPerSession);
  }
}
