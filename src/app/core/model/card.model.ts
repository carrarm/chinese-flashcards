import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

export interface CardModel {
  id?: number;
  meanings: string[];
  pinyin?: string;
  characters?: string;
  collectionId: number;
  leitnerBox: number;
  lastSession?: string;
}

/**
 * Review delay for each box from 0 to 6 (using the index of the array)
 */
const boxReviewDelay = [0, 0.5, 1, 2, 4, 7, 14];

export class Card implements CardModel {
  id?: number;
  meanings: string[] = [];
  pinyin?: string;
  characters?: string;
  collectionId = 0;
  leitnerBox = 5;
  lastSession?: string;

  constructor(data?: CardModel) {
    if (data) {
      Object.assign(this, data);
    }
  }

  isUnknown(): boolean {
    return this.leitnerBox === 0 || !this.lastSession;
  }

  nextReview(): Dayjs | undefined {
    return this.isUnknown()
      ? undefined
      : dayjs(this.lastSession).add(boxReviewDelay[this.leitnerBox], 'day');
  }

  isKnown(): boolean {
    return !this.isUnknown() && dayjs().isBefore(this.nextReview());
  }

  needsReview(): boolean {
    const nextSession = this.nextReview();
    return (
      (!this.isUnknown() && dayjs().isSame(nextSession)) ||
      dayjs().isAfter(nextSession)
    );
  }
}
