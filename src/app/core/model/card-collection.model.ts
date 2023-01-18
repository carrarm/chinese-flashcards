import { Card } from './card.model';

export interface CardCollection {
  id: number;
  label: string;
  cards: Card[];
}
