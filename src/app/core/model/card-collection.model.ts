import { Card } from './card.model';

export interface CardCollectionModel {
  id?: number;
  label: string;
}

export interface CardCollection extends CardCollectionModel {
  cards: Card[];
}
