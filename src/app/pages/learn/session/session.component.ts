import { Component, inject, OnInit } from "@angular/core";
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
  standalone: false,
})
export class SessionComponent implements PendingChangesComponent, OnInit {
  private readonly cardService = inject(CardService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly tabBarService = inject(TabBarService);
  private readonly navigationService = inject(NavigationService);
  private readonly learningSessionService = inject(LearningSessionService);
  private readonly settingsService = inject(SettingsService);

  protected sessionCards: Card[] = [];
  protected isMatchingStep = false;
  protected isFillingStep = false;
  protected isSessionDone = false;
  protected sessionResults: SessionCard[] = [];

  private invalidSession = false;

  public canDeactivate(): Observable<boolean> {
    return this.invalidSession || this.isSessionDone
      ? of(true)
      : this.dialog
          .open(ConfirmDialogComponent, {
            data: {
              confirmType: "primary",
              confirmText: "Stop session",
              cancelText: "Forget it",
              title: "Stop this session",
              message: "You will lose any progress made during the session.",
            },
          })
          .afterClosed()
          // Need to use a pipe because "undefined" does not prevent the route change
          .pipe(map((confirmed) => !!confirmed));
  }

  public ngOnInit(): void {
    this.navigationService.setTitle("Learning session");
    this.sessionCards = this.learningSessionService.currentSession();
    if (!this.sessionCards.length) {
      this.invalidSession = true;
      this.router.navigateByUrl("/sessions");
    }
    this.settingsService.getSettings().then((settings) => {
      this.isMatchingStep =
        this.learningSessionService.isLearningSession() || settings.enableReviewMatching;
      this.isFillingStep = !this.isMatchingStep;
    });
    this.tabBarService.setActions([
      {
        icon: faCircleStop,
        label: "Stop session",
        action: () => this.router.navigateByUrl("/sessions"),
      },
    ]);
  }

  protected matchingCompleted(): void {
    this.isMatchingStep = false;
    this.isFillingStep = true;
  }

  protected sessionCompleted(cards: SessionCard[]): void {
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
