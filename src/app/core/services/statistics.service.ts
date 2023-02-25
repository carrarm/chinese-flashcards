import { Injectable } from '@angular/core';
import { Database } from '../db/database.model';
import { DatabaseService } from '../db/database.service';
import { CardCollection } from '../model/card-collection.model';
import { Card } from '../model/card.model';
import { CollectionStats } from '../model/statistics.model';
import { CollectionService } from './collection.service';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private database: Database;

  constructor(
    private collectionService: CollectionService,
    databaseService: DatabaseService
  ) {
    this.database = databaseService.database;
  }

  async getCollectionReviewStats(
    collectionId: number
  ): Promise<CollectionStats> {
    const toLearn = await this.collectionService
      .getUnknownCardRequest(collectionId)
      .count();

    const known = await this.collectionService
      .getKnownCardRequest(collectionId)
      .count();

    const toReview = await this.collectionService
      .getReviewCardRequest(collectionId)
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
