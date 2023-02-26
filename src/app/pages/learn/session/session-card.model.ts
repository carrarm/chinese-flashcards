import * as dayjs from 'dayjs';
import { Card } from 'src/app/core/model/card.model';

export class SessionCard {
  card: Card;
  mistakes: number;

  get id(): number {
    return this.card.id ?? 0;
  }

  get pinyin(): string | undefined {
    return this.card.pinyin;
  }

  get characters(): string | undefined {
    return this.card.characters;
  }

  get nextReview(): number {
    return this.card.nextReviewInDays();
  }

  constructor(card: Card) {
    this.card = card;
    this.mistakes = 0;
  }

  getNumberOfRepetitions(): number {
    if (this.card.leitnerBox <= 2) {
      return 5;
    }

    if (this.card.leitnerBox <= 4) {
      return 3;
    }

    return 2;
  }

  /**
   * Compute the new Leitner box based on the number of mistakes.
   * 0 mistake: move to the next box
   * 1 mistake: stay in the same box
   * 2+ mistakes: move to the previous box
   */
  endSession(): void {
    if (this.mistakes === 0) {
      this.card.moveNextBox();
    } else if (this.mistakes > 1) {
      this.card.movePreviousBox();
    }
    this.card.lastSession = dayjs().toISOString();
  }
}
