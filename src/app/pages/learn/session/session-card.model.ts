import * as dayjs from "dayjs";
import { Card, CardDifficultyLevel } from "src/app/core/model/card.model";

const EASY_REPS = 2;
const MEDIUM_REPS = 3;
const HARD_REPS = 4;

type SessionProgress = "up" | "down" | "flat";

export class SessionCard {
  card: Card;
  mistakes: number;
  numberOfRepetitions = 0;
  currentRepetitions = 0;
  sessionResultIcon: string = "trending_flat";
  sessionProgress: SessionProgress = "flat";

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
    this.numberOfRepetitions = this.getNumberOfRepetitions();
  }

  changeDifficulty(difficulty: CardDifficultyLevel): void {
    if (this.card.difficulty === difficulty) {
      this.card.difficulty = undefined;
    } else {
      this.card.difficulty = difficulty;
    }
    this.numberOfRepetitions = this.getNumberOfRepetitions();
    if (this.currentRepetitions > this.numberOfRepetitions) {
      this.currentRepetitions = this.numberOfRepetitions;
    }
  }

  /**
   * Computes the new Leitner box based on the number of mistakes.
   * 0 mistake: move to the next box
   * 1 mistake: stay in the same box
   * 2+ mistakes: move to the previous box
   */
  endSession(): void {
    if (this.mistakes === 0) {
      this.sessionProgress = "up";
      this.card.moveNextBox();
    } else if (this.mistakes > 1) {
      this.sessionProgress = "down";
      this.card.movePreviousBox();
    }
    // Use one of Material's trending_up/down/flat icons
    this.sessionResultIcon = "trending_" + this.sessionProgress;
    this.card.lastSession = dayjs().toISOString();
  }

  /**
   * Gets the number of repetitions required to learn the card
   * based on the difficulty (if set) or the Leitner box.
   *
   * @returns Number of repetitions
   */
  private getNumberOfRepetitions(): number {
    switch (this.card.difficulty) {
      case "easy":
        return EASY_REPS;
      case "medium":
        return MEDIUM_REPS;
      case "hard":
        return HARD_REPS;
      default:
        return this.getDefaultRepetitions();
    }
  }

  /**
   * Gets the number of repetitions based on the Leitner box.
   *
   * @returns  Number of repetitions
   */
  private getDefaultRepetitions(): number {
    if (this.card.leitnerBox <= 2) {
      return HARD_REPS;
    }

    if (this.card.leitnerBox <= 4) {
      return MEDIUM_REPS;
    }

    return EASY_REPS;
  }
}
