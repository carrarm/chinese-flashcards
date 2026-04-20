import { inject, Injectable, signal } from "@angular/core";
import { Collection } from "dexie";
import { Database } from "../db/database.model";
import { DatabaseService } from "../db/database.service";
import { CardCollection, CardCollectionModel } from "../model/card-collection.model";
import { Card, CardModel } from "../model/card.model";

@Injectable({
  providedIn: "root",
})
export class CollectionService {
  private readonly databaseService = inject(DatabaseService);

  private readonly database: Database = this.databaseService.database;

  public readonly allCardsCollection = signal<CardCollection>(new CardCollection({
    id: -1,
    label: "All collections"
  }));

  public async getCollections(fetchCards = true, session = false): Promise<CardCollection[]> {
    try {
      const collections = await this.database.cardCollections
        .orderBy("label")
        .toArray();

      let result: CardCollection[] = [];

      if (fetchCards) {
        result = await Promise.all(
          collections.map((collection) => this.loadCollectionCards(collection))
        );
        if (!session) {
          this.updateAllCardsCollection(result);
          result = [...result, this.allCardsCollection()];
        }
      } else {
        result = collections.map((collection) => new CardCollection(collection));
      }

      return result;
    } catch (error) {
      console.error("Unable to load card collections", error);
      return [];
    }
  }

  public async getCollection(id: number): Promise<CardCollection | undefined> {
    if (id === this.allCardsCollection().id) {
      if (!this.allCardsCollection().cards.length) {
        await this.getCollections();
      }
      return this.allCardsCollection();
    } else {
      const cardCollection = await this.database.cardCollections.get(id);
      return cardCollection ? this.loadCollectionCards(cardCollection) : undefined;
    }
  }

  public async getCollectionByName(
    collectionName: string
  ): Promise<CardCollection | undefined> {
    const cardCollection = await this.database.cardCollections
      .filter((collection) => collection.label === collectionName)
      .first();
    return cardCollection ? this.loadCollectionCards(cardCollection) : cardCollection;
  }

  public createCollection(collection: CardCollectionModel): Promise<number> {
    return this.database.cardCollections.add(collection);
  }

  public updateCollection(collection: CardCollectionModel): Promise<number> {
    return this.database.cardCollections.put(collection);
  }

  public deleteCollection(collection: number) {
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
  public getUnknownCardRequest(collectionId?: number): Collection<CardModel, number> {
    const request = collectionId ? { collectionId, leitnerBox: 0 } : { leitnerBox: 0 };
    return this.database.cards.where(request);
  }

  /**
   * Build the Dexie request to fetch known cards for a collection.
   *
   * @param collectionId Card collection id
   * @returns Dexie `Collection<CardModel, number>`
   */
  public getKnownCardRequest(collectionId: number): Collection<CardModel, number> {
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
  public getReviewCardRequest(collectionId?: number): Collection<CardModel, number> {
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

  private updateAllCardsCollection(collections: CardCollection[]): void {
    const allCards = collections.flatMap((collection) => collection.cards);
    this.allCardsCollection.update((collection) => {
      collection.cards = [...allCards];
      return collection;
    });
  }
}
