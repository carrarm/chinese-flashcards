import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CardCollection } from "@core/model/card-collection.model";
import { Settings } from "@core/model/settings.model";
import { CollectionStats } from "@core/model/statistics.model";
import { CollectionService } from "@core/services/collection.service";
import { LearningSessionService } from "@core/services/learning-session.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { StatisticsService } from "@core/services/statistics.service";
import { TabBarService } from "src/app/components/tab-bar/tab-bar.service";

@Component({
  selector: "chf-session-launcher",
  templateUrl: "./session-launcher.component.html",
  styleUrls: ["./session-launcher.component.scss"],
  standalone: false,
})
export class SessionLauncherComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly tabBarService = inject(TabBarService);
  private readonly settingsService = inject(SettingsService);
  private readonly collectionService = inject(CollectionService);
  private readonly statisticsService = inject(StatisticsService);
  private readonly learningSessionService = inject(LearningSessionService);
  private readonly router = inject(Router);

  protected settings?: Settings;
  protected collections: Partial<CardCollection>[] = [];
  protected allCollectionStats?: {
    numbers: CollectionStats;
    percents: CollectionStats;
  };

  public ngOnInit(): void {
    this.navigationService.setTitle("Start a session");
    this.navigationService.resetNavbarText();
    this.tabBarService.resetTabBar();

    this.settingsService.getSettings().then((settings) => (this.settings = settings));
    this.collectionService.getCollections().then(async (collections) => {
      this.collections =
        await this.statisticsService.getCollectionsReviewStats(collections);
      const numberStats: CollectionStats = {
        toLearn: 0,
        toReview: 0,
        known: 0,
      };
      this.collections.forEach((collection) => {
        numberStats.toLearn += collection.statistics?.toLearn ?? 0;
        numberStats.toReview += collection.statistics?.toReview ?? 0;
        numberStats.known += collection.statistics?.known ?? 0;
      });
      this.allCollectionStats = {
        numbers: numberStats,
        percents: CardCollection.computePercentStats(numberStats),
      };
      this.collections.unshift({
        label: "All collections",
        description: "Learn or review cards from all the collections",
        statistics: this.allCollectionStats.numbers,
        percentStatistics: this.allCollectionStats.percents,
      });
    });
  }

  protected async learn(collection?: number): Promise<void> {
    const cardsToLearn =
      await this.learningSessionService.createLearningSession(collection);

    this.learningSessionService.currentSession.set(cardsToLearn);
    this.router.navigateByUrl("/sessions/active");
  }

  protected async review(collection?: number): Promise<void> {
    const cardsToReview =
      await this.learningSessionService.createReviewSession(collection);

    this.learningSessionService.currentSession.set(cardsToReview);
    this.router.navigateByUrl("/sessions/active");
  }
}
