import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CardCollection } from "@core/model/card-collection.model";
import { Settings } from "@core/model/settings.model";
import { CollectionStats } from "@core/model/statistics.model";
import { CollectionService } from "@core/services/collection.service";
import { LearningSessionService } from "@core/services/learning-session.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { StatisticsService } from "@core/services/statistics.service";

@Component({
  selector: "chf-session-launcher",
  templateUrl: "./session-launcher.component.html",
  styleUrls: ["./session-launcher.component.scss"],
})
export class SessionLauncherComponent implements OnInit {
  public settings?: Settings;
  public collections: CardCollection[] = [];
  public allCollectionStats?: {
    numbers: CollectionStats;
    percents: CollectionStats;
  };

  constructor(
    private navigationService: NavigationService,
    private settingsService: SettingsService,
    private collectionService: CollectionService,
    private statisticsService: StatisticsService,
    private learningSessionService: LearningSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.navigationService.setTitle("Start a session");
    this.settingsService.getSettings().then((settings) => (this.settings = settings));
    this.collectionService.getCollections().then(async (collections) => {
      this.collections = await this.statisticsService.getCollectionsReviewStats(
        collections
      );
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
    });
  }

  async learn(collection?: number): Promise<void> {
    const cardsToLearn = await this.learningSessionService.createLearningSession(
      collection
    );

    this.learningSessionService.currentSession.next(cardsToLearn);
    this.router.navigateByUrl("/sessions/active");
  }

  async review(collection?: number): Promise<void> {
    const cardsToReview = await this.learningSessionService.createReviewSession(
      collection
    );

    this.learningSessionService.currentSession.next(cardsToReview);
    this.router.navigateByUrl("/sessions/active");
  }
}
