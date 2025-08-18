import { inject, Injectable } from "@angular/core";

import { CardCollection } from "../model/card-collection.model";
import { CollectionStats } from "../model/statistics.model";
import { CollectionService } from "./collection.service";

@Injectable({ providedIn: "root" })
export class StatisticsService {
  private readonly collectionService = inject(CollectionService);

  public async getCollectionReviewStats(collectionId: number): Promise<CollectionStats> {
    const toLearn = await this.collectionService
      .getUnknownCardRequest(collectionId)
      .count();

    const known = await this.collectionService.getKnownCardRequest(collectionId).count();

    const toReview = await this.collectionService
      .getReviewCardRequest(collectionId)
      .count();

    return { toLearn, toReview, known };
  }

  public async getCollectionsReviewStats(
    collections: CardCollection[]
  ): Promise<CardCollection[]> {
    const promises = collections.map(async (collection) => {
      collection.setStatistics(await this.getCollectionReviewStats(collection.id));
      return collection;
    });
    await Promise.all(promises);
    return collections;
  }
}
