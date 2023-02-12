import { Injectable } from '@angular/core';
import { Card } from '../model/card.model';
import { Database } from '../db/database.model';
import { DatabaseService } from '../db/database.service';

@Injectable({
  providedIn: 'root',
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
    let error = 'ID is undefined';
    if (card.id) {
      try {
        await this.database.cards.put(card);
        return this.getCard(card.id);
      } catch (err: unknown) {
        error =
          typeof err === 'string' ? err : 'An error occurred during the update';
      }
    }
    throw new Error(`Unable to update the card with id ${card.id}: ${error}`);
  }

  async deleteCard(card: Card | number): Promise<void> {
    const cardId = typeof card === 'number' ? card : card.id;
    if (cardId) {
      return this.database.cards.delete(cardId);
    }
  }

  private async getCard(id: number): Promise<Card> {
    const card = await this.database.cards.get(id);
    if (!card) {
      throw new Error(`Card with id ${id} does not exist`);
    }
    return card;
  }
}
