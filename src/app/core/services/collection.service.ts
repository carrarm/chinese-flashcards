import { Injectable } from '@angular/core';
import {
  CardCollection,
  CardCollectionModel,
} from '../model/card-collection.model';
import { Database } from '../model/database.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private database: Database;

  constructor(databaseService: DatabaseService) {
    this.database = databaseService.database;
  }

  async getCollections(): Promise<CardCollection[]> {
    try {
      return await this.database.cardCollections.toArray(
        (collections: CardCollectionModel[]) => {
          const filledCollectionPromises = collections.map((collection) =>
            this.loadCollectionCards(collection)
          );
          return Promise.all(filledCollectionPromises);
        }
      );
    } catch (error) {
      console.error('Unable to load card collections', error);
      return [];
    }
  }

  async getCollection(id: number): Promise<CardCollection | undefined> {
    const cardCollection = await this.database.cardCollections.get(id);
    return cardCollection
      ? this.loadCollectionCards(cardCollection)
      : undefined;
  }

  private async loadCollectionCards(
    collection: CardCollectionModel
  ): Promise<CardCollection> {
    const cardCollection: CardCollection = { ...collection, cards: [] };
    await this.database.cards
      .where({ collectionId: collection.id })
      .toArray((cards) => (cardCollection.cards = cards));
    return cardCollection;
  }
}
