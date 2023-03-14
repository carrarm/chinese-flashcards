import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Card } from "src/app/core/model/card.model";
import { CardService } from "src/app/core/services/card.service";
import { LearningSessionService } from "src/app/core/services/learning-session.service";
import { NavigationService } from "src/app/core/services/navigation.service";
import { SettingsService } from "src/app/core/services/settings.service";
import { SessionCard } from "./session-card.model";

@Component({
  selector: "chf-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent {
  public sessionCards: Card[] = [];
  public isMatchingStep = false;
  public isFillingStep = false;
  public isSessionDone = false;
  public sessionResults: SessionCard[] = [];

  constructor(
    private cardService: CardService,
    learningSessionService: LearningSessionService,
    settingsService: SettingsService,
    router: Router,
    navigationService: NavigationService
  ) {
    navigationService.setTitle("Learning session");
    this.sessionCards = learningSessionService.currentSession.getValue();
    if (!this.sessionCards.length) {
      router.navigateByUrl("/sessions");
    }
    settingsService.getSettings().then((settings) => {
      this.isMatchingStep =
        learningSessionService.isLearningSession() || settings.enableReviewMatching;
      this.isFillingStep = !this.isMatchingStep;
    });
  }

  matchingCompleted(): void {
    this.isMatchingStep = false;
    this.isFillingStep = true;
  }

  sessionCompleted(cards: SessionCard[]): void {
    this.isFillingStep = false;
    this.isSessionDone = true;
    this.sessionResults = cards;
    const toUpdate: Card[] = [];
    cards.forEach((sessionCard) => {
      sessionCard.endSession();
      toUpdate.push(sessionCard.card);
    });
    this.cardService.updateCards(toUpdate);
  }
}
