import Dexie, { Table } from 'dexie';
import { CardCollectionModel } from './card-collection.model';
import { CardModel } from './card.model';

export class Database extends Dexie {
  public cards!: Table<CardModel, number>;
  public cardCollections!: Table<CardCollectionModel, number>;

  constructor() {
    super('chinese-cards');
    this.version(3).stores({
      cardCollections: '++id',
      cards: '++id, collectionId',
    });
    this.on('populate', () => this.populate());
  }

  private async populate() {
    console.log('Populating database with demo cards and collections');
    const firstCollection = await this.cardCollections.add({
      label: 'Animals',
    });
    await this.cards.bulkAdd([
      {
        meanings: ['Horse'],
        pinyin: 'mǎ',
        characters: '马',
        collectionId: firstCollection,
      },
      {
        meanings: ['Goat'],
        pinyin: 'yáng',
        characters: '羊',
        collectionId: firstCollection,
      },
      {
        meanings: ['Rooster'],
        pinyin: 'gōng jī',
        characters: '公鸡',
        collectionId: firstCollection,
      },
      {
        meanings: ['Dog'],
        pinyin: 'gǒu',
        characters: '狗',
        collectionId: firstCollection,
      },
    ]);

    const secondCollection = await this.cardCollections.add({
      label: 'Numbers',
    });
    await this.cards.bulkAdd([
      {
        meanings: ['One', 'First'],
        pinyin: 'yī',
        characters: '一',
        collectionId: secondCollection,
      },
      {
        meanings: ['Two'],
        pinyin: 'èr',
        characters: '二',
        collectionId: secondCollection,
      },
      {
        meanings: ['Three'],
        pinyin: 'sān',
        characters: '三',
        collectionId: secondCollection,
      },
      {
        meanings: ['Four'],
        pinyin: 'sì',
        characters: '四',
        collectionId: secondCollection,
      },
      {
        meanings: ['Five'],
        pinyin: 'wǔ',
        characters: '五',
        collectionId: secondCollection,
      },
    ]);
  }
}
