import Dexie, { Table } from 'dexie';
import { environment } from 'src/environments/environment';
import { CardCollectionModel } from '../model/card-collection.model';
import { CardModel } from '../model/card.model';
import { SettingsModel } from '../model/settings.model';
import { upgrades } from './database-upgrades';

export class Database extends Dexie {
  public cards!: Table<CardModel, number>;
  public cardCollections!: Table<CardCollectionModel, number>;
  public settings!: Table<SettingsModel, number>;

  constructor() {
    super('chinese-cards');
    this.version(environment.dbVersion)
      .stores({
        cardCollections: '++id',
        cards: '++id, collectionId',
        settings: '++id',
      })
      .upgrade(upgrades[environment.dbVersion]);

    if (!environment.production) {
      this.on('populate', () => this.populate());
    }
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
        leitnerBox: 5,
      },
      {
        meanings: ['Goat'],
        pinyin: 'yáng',
        characters: '羊',
        collectionId: firstCollection,
        leitnerBox: 2,
      },
      {
        meanings: ['Rooster'],
        pinyin: 'gōng jī',
        characters: '公鸡',
        collectionId: firstCollection,
        leitnerBox: 0,
      },
      {
        meanings: ['Dog'],
        pinyin: 'gǒu',
        characters: '狗',
        collectionId: firstCollection,
        leitnerBox: 0,
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
        leitnerBox: 3,
      },
      {
        meanings: ['Two'],
        pinyin: 'èr',
        characters: '二',
        collectionId: secondCollection,
        leitnerBox: 1,
      },
      {
        meanings: ['Three'],
        pinyin: 'sān',
        characters: '三',
        collectionId: secondCollection,
        leitnerBox: 3,
      },
      {
        meanings: ['Four'],
        pinyin: 'sì',
        characters: '四',
        collectionId: secondCollection,
        leitnerBox: 0,
      },
      {
        meanings: ['Five'],
        pinyin: 'wǔ',
        characters: '五',
        collectionId: secondCollection,
        leitnerBox: 0,
      },
    ]);
  }
}
