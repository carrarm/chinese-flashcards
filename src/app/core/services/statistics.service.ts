import { Injectable } from '@angular/core';
import { Database } from '../db/database.model';
import { DatabaseService } from '../db/database.service';
import { CardCollection } from '../model/card-collection.model';
import { Card } from '../model/card.model';
import { CollectionStats } from '../model/statistics.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private database: Database;

  constructor(databaseService: DatabaseService) {
    this.database = databaseService.database;
  }

  async getCollectionReviewStats(
    collectionId: number
  ): Promise<CollectionStats> {
    const toLearn = await this.database.cards
      .where({ collectionId, leitnerBox: 0 })
      .count();

    const known = await this.database.cards
      .where({ collectionId })
      .and((card) => new Card(card).isKnown())
      .count();

    const toReview = await this.database.cards
      .where({ collectionId })
      .and((card) => new Card(card).needsReview())
      .count();

    return { toLearn, toReview, known };
  }

  getCollectionsReviewStats(
    collections: CardCollection[]
  ): Promise<CardCollection[]> {
    const promises = collections.map(async (collection) => {
      collection.setStatistics(
        await this.getCollectionReviewStats(collection.id)
      );
      return collection;
    });
    return Promise.all(promises).then(() => collections);
  }
}
