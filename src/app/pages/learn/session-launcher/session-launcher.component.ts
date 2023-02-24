import { Component } from '@angular/core';
import { CardCollection } from 'src/app/core/model/card-collection.model';
import { Settings } from 'src/app/core/model/settings.model';
import { CollectionStats } from 'src/app/core/model/statistics.model';
import { CollectionService } from 'src/app/core/services/collection.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { StatisticsService } from 'src/app/core/services/statistics.service';

@Component({
  selector: 'chf-session-launcher',
  templateUrl: './session-launcher.component.html',
  styleUrls: ['./session-launcher.component.scss'],
})
export class SessionLauncherComponent {
  public settings?: Settings;
  public collections: CardCollection[] = [];

  constructor(
    private navigationService: NavigationService,
    private settingsService: SettingsService,
    private collectionService: CollectionService,
    private statisticsService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.navigationService.setTitle('Start a session');
    this.settingsService
      .getSettings()
      .then((settings) => (this.settings = settings));
    this.collectionService.getCollections().then(async (collections) => {
      this.collections = await this.statisticsService.getCollectionsReviewStats(
        collections
      );
    });
  }
}
