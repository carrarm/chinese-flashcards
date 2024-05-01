import { Injectable } from "@angular/core";
import { Collection } from "dexie";
import { Database } from "../db/database.model";
import { DatabaseService } from "../db/database.service";
import { CardCollection, CardCollectionModel } from "../model/card-collection.model";
import { Card, CardModel } from "../model/card.model";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private database: Database;

  constructor(databaseService: DatabaseService) {
    this.database = databaseService.database;
  }

  async getCollections(): Promise<CardCollection[]> {
    try {
      return await this.database.cardCollections
        .orderBy("label")
        .toArray((collections: CardCollectionModel[]) => {
          const filledCollectionPromises = collections.map((collection) =>
            this.loadCollectionCards(collection)
          );
          return Promise.all(filledCollectionPromises);
        });
    } catch (error) {
      console.error("Unable to load card collections", error);
      return [];
    }
  }

  async getCollection(id: number): Promise<CardCollection | undefined> {
    const cardCollection = await this.database.cardCollections.get(id);
    return cardCollection ? this.loadCollectionCards(cardCollection) : undefined;
  }

  createCollection(collection: CardCollectionModel): Promise<number> {
    return this.database.cardCollections.add(collection);
  }

  updateCollection(collection: CardCollectionModel): Promise<number> {
    return this.database.cardCollections.put(collection);
  }

  deleteCollection(collection: number) {
    this.database.cardCollections.delete(collection);
    const cards = this.database.cards.filter((card) => card.collectionId === collection);
    cards.delete();
  }

  /**
   * Build the Dexie request to fetch unknown cards for a collection.
   *
   * @param collectionId Card collection id
   * @returns Dexie `Collection<CardModel, number>`
   */
  getUnknownCardRequest(collectionId?: number): Collection<CardModel, number> {
    const request = collectionId ? { collectionId, leitnerBox: 0 } : { leitnerBox: 0 };
    return this.database.cards.where(request);
  }

  /**
   * Build the Dexie request to fetch known cards for a collection.
   *
   * @param collectionId Card collection id
   * @returns Dexie `Collection<CardModel, number>`
   */
  getKnownCardRequest(collectionId: number): Collection<CardModel, number> {
    return this.database.cards
      .where({ collectionId })
      .and((card) => new Card(card).isKnown());
  }

  /**
   * Build the Dexie request to fetch cards ready for review for a collection.
   *
   * @param collectionId Card collection id
   * @returns Dexie `Collection<CardModel, number>`
   */
  getReviewCardRequest(collectionId?: number): Collection<CardModel, number> {
    if (collectionId) {
      return this.database.cards
        .where({ collectionId })
        .and((card) => new Card(card).needsReview());
    } else {
      return this.database.cards
        .toCollection()
        .and((card: CardModel) => new Card(card).needsReview());
    }
  }

  private async loadCollectionCards(
    collection: CardCollectionModel
  ): Promise<CardCollection> {
    const cardCollection: CardCollection = new CardCollection(collection);
    await this.database.cards
      .where({ collectionId: collection.id })
      .toArray((cards) => cardCollection.addCards(cards));
    return cardCollection;
  }
}
