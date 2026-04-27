import dayjs from "dayjs";

export type CardDifficultyLevel = "easy" | "medium" | "hard";

export const defaultNextSession = dayjs('1970-01-01').toISOString();

export interface CardModel {
  id?: number;
  meanings: string[];
  pinyin?: string;
  characters?: string;
  collectionId: number;
  collectionName?: string;
  leitnerBox: number;
  lastSession?: string;
  nextSession: string;
  difficulty?: CardDifficultyLevel;
  archived?: boolean;
}

/**
 * Review delay for each box from 0 to 6 (using the index of the array)
 */
export const boxReviewDelay = [0, 0.5, 1, 2, 4, 7, 14];

export class Card implements CardModel {
  id?: number;
  meanings: string[] = [];
  pinyin?: string;
  characters?: string;
  collectionId = 0;
  collectionName?: string;
  leitnerBox = 0;
  lastSession?: string;
  nextSession: string = defaultNextSession;
  difficulty?: CardDifficultyLevel;
  archived?: boolean;

  constructor(data?: CardModel, collectionName?: string) {
    if (data) {
      Object.assign(this, data);
    }
    this.collectionName = collectionName;
  }

  isUnknown(): boolean {
    return this.leitnerBox === 0 || !this.lastSession;
  }

  nextReview(): string {
    return this.isUnknown()
      ? defaultNextSession
      : dayjs(this.lastSession).add(boxReviewDelay[this.leitnerBox], "day").toISOString();
  }

  nextReviewInDays(): number {
    return boxReviewDelay[this.leitnerBox];
  }

  isKnown(): boolean {
    const nextReview = dayjs(this.nextReview());
    return this.archived || (!this.isUnknown() && dayjs().isBefore(nextReview));
  }

  moveNextBox(): void {
    if (this.leitnerBox < boxReviewDelay.length - 1) {
      this.leitnerBox++;
    }
  }

  movePreviousBox(): void {
    if (this.leitnerBox > 0) {
      this.leitnerBox--;
    }
  }

  reset(): void {
    this.leitnerBox = 0;
    this.lastSession = undefined;
    this.difficulty = undefined;
  }

  clone(): Card {
    const clone = new Card(this);
    clone.meanings = [...clone.meanings];
    return clone;
  }
}
