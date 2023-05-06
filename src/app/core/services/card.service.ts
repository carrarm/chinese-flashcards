import { Injectable } from "@angular/core";
import { Database } from "@core/db/database.model";
import { DatabaseService } from "@core/db/database.service";
import { Card } from "@core/model/card.model";
import { Optional } from "@core/types";
import { areEqual } from "@core/utils/general.utils";

@Injectable({
  providedIn: "root",
})
export class CardService {
  private database: Database;

  constructor(databaseService: DatabaseService) {
    this.database = databaseService.database;
  }

  async createCard(card: Card, collection: number): Promise<Card> {
    card.collectionId = collection;
    const newCardId = await this.database.cards.add(card);
    return this.getCard(newCardId);
  }

  async updateCard(card: Card): Promise<Card> {
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

  async updateCards(cards: Card[]): Promise<unknown> {
    return this.database.cards.bulkPut(cards);
  }

  async deleteCard(card: Card | number): Promise<void> {
    const cardId = typeof card === "number" ? card : card.id;
    if (cardId) {
      return this.database.cards.delete(cardId);
    }
  }

  async findCard(search: {
    meanings?: Optional<string[]>;
    pinyin?: Optional<string>;
    characters?: Optional<string>;
  }): Promise<Card | undefined> {
    const cardModel = await this.database.cards
      .filter(
        (card) =>
          search.meanings?.some((meaning) =>
            card.meanings.some((cardMeaning) => areEqual(cardMeaning, meaning))
          ) ||
          areEqual(search.pinyin, card.pinyin) ||
          areEqual(search.characters, card.characters)
      )
      .first();
    return cardModel ? new Card(cardModel) : undefined;
  }

  private async getCard(id: number): Promise<Card> {
    const card = await this.database.cards.get(id);
    if (!card) {
      throw new Error(`Card with id ${id} does not exist`);
    }
    return new Card(card);
  }
}
