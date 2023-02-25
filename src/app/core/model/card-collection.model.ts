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
    this.percentStatistics = CardCollection.computePercentStats(stats);
  }

  static computePercentStats(stats: CollectionStats): CollectionStats {
    const totalCards = stats.toLearn + stats.known + stats.toReview;
    return {
      toLearn: CardCollection.cardPercentage(stats.toLearn, totalCards),
      toReview: CardCollection.cardPercentage(stats.toReview, totalCards),
      known: CardCollection.cardPercentage(stats.known, totalCards),
    };
  }

  private static cardPercentage(value: number, totalCards: number): number {
    return (value * 100) / totalCards;
  }
}
