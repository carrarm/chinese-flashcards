import { inject, Injectable } from "@angular/core";
import { Database } from "@core/db/database.model";
import { DatabaseService } from "@core/db/database.service";
import { Card } from "@core/model/card.model";
import { areEqual } from "@core/utils/general.utils";

@Injectable({
  providedIn: "root",
})
export class CardService {
  private readonly databaseService = inject(DatabaseService);

  private readonly database: Database = this.databaseService.database;

  public async createCard(card: Card, collection: number): Promise<Card> {
    card.collectionId = collection;
    const newCardId = await this.database.cards.add(card);
    return this.getCard(newCardId);
  }

  public async updateCard(card: Card): Promise<Card> {
    let error = "ID is undefined";
    if (card.id) {
      try {
        await this.database.cards.put(card);
        return this.getCard(card.id);
      } catch (err: unknown) {
        error = typeof err === "string" ? err : "An error occurred during the update";
      }
    }
    throw new Error(`Unable to update the card with id ${card.id}: ${error}`);
  }

  public async updateCards(cards: Card[]): Promise<unknown> {
    return this.database.cards.bulkPut(cards);
  }

  public async deleteCard(card: Card | number): Promise<void> {
    const cardId = typeof card === "number" ? card : card.id;
    if (cardId) {
      return this.database.cards.delete(cardId);
    }
  }

  public async findCard(
    fromCollection: number,
    search: {
      meanings?: string[];
      pinyin?: string;
      characters?: string;
    }
  ): Promise<Card | undefined> {
    const cardModel = await this.database.cards
      .filter(
        (card) =>
          card.collectionId === fromCollection &&
          (search.meanings?.some((meaning) =>
            card.meanings.some((cardMeaning) => areEqual(cardMeaning, meaning))
          ) ||
            areEqual(search.pinyin, card.pinyin) ||
            areEqual(search.characters, card.characters))
      )
      .first();
    return cardModel ? new Card(cardModel) : undefined;
  }

  public async getCard(id: number): Promise<Card> {
    const card = await this.database.cards.get(id);
    if (!card) {
      throw new Error(`Card with id ${id} does not exist`);
    }
    return new Card(card);
  }
}
