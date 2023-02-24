import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Database } from '../db/database.model';
import { DatabaseService } from '../db/database.service';
import { Card } from '../model/card.model';
import { CollectionService } from './collection.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class LearningSessionService {
  public readonly currentSession = new BehaviorSubject<Card[]>([]);

  private database: Database;

  constructor(
    private collectionService: CollectionService,
    private settingsService: SettingsService,
    databaseService: DatabaseService
  ) {
    this.database = databaseService.database;
  }

  async createLearningSession(collection: number): Promise<Card[]> {
    const cards = await this.collectionService
      .getUnknownCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .toArray();

    return cards.map((card) => new Card(card));
  }

  async createReviewSession(collection: number): Promise<Card[]> {
    const cards = await this.collectionService
      .getReviewCardRequest(collection)
      .limit(await this.getWordsPerSession())
      .reverse()
      .sortBy('leitnerBox');

    return cards.map((card) => new Card(card));
  }

  private getWordsPerSession(): Promise<number> {
    return this.settingsService
      .getSettings()
      .then((settings) => settings.wordsPerSession);
  }
}
