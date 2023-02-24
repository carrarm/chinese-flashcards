import { Card, CardModel } from './card.model';
import { CollectionStats } from './statistics.model';

export interface CardCollectionModel {
  id?: number;
  label: string;
  description?: string;
}

export class CardCollection implements CardCollectionModel {
  id: number;
  label: string;
  description?: string | undefined;
  cards: Card[];
  statistics?: CollectionStats;
  percentStatistics?: CollectionStats;

  constructor(collection: CardCollectionModel) {
    this.id = collection.id ?? 0;
    this.label = collection.label;
    this.description = collection.description;
    this.cards = [];
  }

  addCards(cards: CardModel[]): void {
    this.cards = cards.map((card) => new Card(card));
  }

  setStatistics(stats: CollectionStats): void {
    this.statistics = stats;
    this.percentStatistics = {
      toLearn: this.cardPercentage(stats.toLearn),
      toReview: this.cardPercentage(stats.toReview),
      known: this.cardPercentage(stats.known),
    };
  }

  private cardPercentage(value: number): number {
    return (value * 100) / this.cards.length;
  }
}
