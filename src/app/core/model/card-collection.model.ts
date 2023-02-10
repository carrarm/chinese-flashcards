import { Card } from './card.model';

export interface CardCollectionModel {
  id?: number;
  label: string;
  description?: string;
}

export interface CardCollection extends CardCollectionModel {
  cards: Card[];
}
