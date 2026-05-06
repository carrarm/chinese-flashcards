import { inject, Injectable, signal } from "@angular/core";
import { SessionCard } from "@pages/learn/session/session-card.model";
import { omit } from "lodash-es";
import { Card } from "../model/card.model";
import { CollectionService } from "./collection.service";
import { SettingsService } from "./settings.service";

type SessionType = "review" | "learn";
type SessionStep = "filling" | "matching";

interface SessionState {
  sessionType: SessionType;
  sessionStep: SessionStep;
  cards: SessionCard[];
}

const SESSION_STORAGE_KEY = "activeSession";

@Injectable({
  providedIn: "root",
})
export class LearningSessionService {
  public readonly sessionCards = signal<SessionCard[]>([]);
  public readonly sessionType = signal<SessionType>("learn");
  public readonly sessionStep = signal<SessionStep>("filling");

  private readonly collectionService = inject(CollectionService);
  private readonly settingsService = inject(SettingsService);

  public clearActiveSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.sessionCards.set([]);
  }

  public async createLearningSession(collection?: number): Promise<SessionCard[]> {
    const cards = await this.collectionService
      .getUnknownCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .toArray();

    this.sessionType.set("learn");

    return cards.map((card) => new SessionCard(new Card(card)));
  }

  public async createReviewSession(
    archivedSession: boolean,
    collection?: number
  ): Promise<SessionCard[]> {
    const settings = await this.settingsService.getSettings();
    const cards = archivedSession
      ? await this.collectionService
          .getArchivedCardRequest(collection)
          .sortBy("nextSession")
      : await this.collectionService
          .getReviewCardRequest(collection)
          .sortBy("leitnerBox");

    if (settings.cardSelectionType === "oldest") {
      cards.reverse();
    }

    this.sessionType.set("review");

    return cards
      .slice(0, settings.wordsPerSession)
      .map((card) => new SessionCard(new Card(card)));
  }

  public hasActiveSession(): boolean {
    return !!localStorage.getItem(SESSION_STORAGE_KEY);
  }

  public isLearningSession(): boolean {
    return this.sessionType() === "learn";
  }

  public restoreSession(): void {
    const rawSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) {
      return;
    }
    const session: SessionState = JSON.parse(rawSession);

    // Recreate instances, they are currently basic objects
    const cards: SessionCard[] = [];
    session.cards.forEach((sessionCard: SessionCard) => {
      const cardInstance = new Card(sessionCard.card);
      const sessionInstance = new SessionCard(cardInstance);
      Object.assign(sessionInstance, omit(sessionCard, ["card"]));
      cards.push(sessionInstance);
    });

    this.sessionCards.set(cards);
    this.sessionStep.set(session.sessionStep);
    this.sessionType.set(session.sessionType);
  }

  public saveSession(): void {
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({
        sessionType: this.sessionType(),
        sessionStep: this.sessionStep(),
        cards: this.sessionCards(),
      } satisfies SessionState)
    );
  }

  private async getWordsPerSession(): Promise<number> {
    const settings = await this.settingsService.getSettings();
    return settings.wordsPerSession;
  }
}
