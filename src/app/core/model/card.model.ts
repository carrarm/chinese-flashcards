export interface CardModel {
  id?: number;
  meanings: string[];
  pinyin?: string;
  characters?: string;
  collectionId: number;
}

export interface Card extends CardModel {}
