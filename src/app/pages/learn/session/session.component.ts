import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { PendingChangesComponent } from "@core/guards/pending-changes.guard";
import { Card } from "@core/model/card.model";
import { CardService } from "@core/services/card.service";
import { LearningSessionService } from "@core/services/learning-session.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { faCircleStop, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { Observable, map, of } from "rxjs";
import { ConfirmDialogComponent } from "src/app/components/dialog/confirm-dialog/confirm-dialog.component";
import { TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { SessionCard } from "./session-card.model";

@Component({
  selector: "chf-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements PendingChangesComponent {
  public sessionCards: Card[] = [];
  public isMatchingStep = false;
  public isFillingStep = false;
  public isSessionDone = false;
  public sessionResults: SessionCard[] = [];

  private invalidSession = false;

  constructor(
    private cardService: CardService,
    private dialog: MatDialog,
    private router: Router,
    private tabBarService: TabBarService,
    private navigationService: NavigationService,
    learningSessionService: LearningSessionService,
    settingsService: SettingsService
  ) {
    navigationService.setTitle("Learning session");
    this.sessionCards = learningSessionService.currentSession.getValue();
    if (!this.sessionCards.length) {
      this.invalidSession = true;
      router.navigateByUrl("/sessions");
    }
    settingsService.getSettings().then((settings) => {
      this.isMatchingStep =
        learningSessionService.isLearningSession() || settings.enableReviewMatching;
      this.isFillingStep = !this.isMatchingStep;
    });
    tabBarService.setActions([
      {
        icon: faCircleStop,
        label: "Cancel session",
        action: () => router.navigateByUrl("/sessions"),
      },
    ]);
  }

  canDeactivate(): Observable<boolean> {
    return this.invalidSession || this.isSessionDone
      ? of(true)
      : this.dialog
          .open(ConfirmDialogComponent, {
            data: {
              confirmType: "primary",
              confirmText: "Yes, stop this session",
              cancelText: "I changed my mind",
              title: "Cancel the session",
              message: "You will lose any progress made during the session.",
            },
          })
          .afterClosed()
          // Need to use a pipe because "undefined" does not prevent the route change
          .pipe(map((confirmed) => !!confirmed));
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
    this.tabBarService.setActions([
      {
        icon: faFlagCheckered,
        label: "End session",
        action: () => this.router.navigateByUrl("/sessions"),
      },
    ]);
    this.navigationService.setNavbarText("Session completed!", "main");
  }
}
