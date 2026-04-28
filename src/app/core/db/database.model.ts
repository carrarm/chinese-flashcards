import dayjs from "dayjs";
import Dexie, { Table } from "dexie";
import { environment } from "src/environments/environment";
import { CardCollectionModel } from "../model/card-collection.model";
import { CardModel, defaultNextSession } from "../model/card.model";
import { SettingsModel } from "../model/settings.model";
import { upgrades } from "./database-upgrades";

const schema = {
  cardCollections: "++id, label",
  cards: `
    ++id, 
    collectionId, 
    collectionName, 
    leitnerBox, 
    nextSession, 
    [collectionId+leitnerBox], 
    [collectionId+nextSession]
  `,
  settings: "++id",
};

export class Database extends Dexie {
  public cards!: Table<CardModel, number>;
  public cardCollections!: Table<CardCollectionModel, number>;
  public settings!: Table<SettingsModel, number>;

  constructor() {
    super("chinese-cards");
    this.version(environment.dbVersion)
      .stores(schema)
      .upgrade(upgrades[environment.dbVersion]);

    if (!environment.production) {
      this.on("populate", () => this.populate());
    }
  }

  public deleteAndRebuild(): Promise<unknown> {
    this.delete();
    this.version(environment.dbVersion).stores(schema);
    return this.open();
  }

  /**
   * Creates a test dataset for development purposes. Should not be used
   * in production.
   */
  private async populate() {
    console.info("Populating database with demo cards and collections");
    const firstCollection = await this.cardCollections.add({
      label: "Animals",
    });
    await this.cards.bulkAdd([
      {
        meanings: ["Horse"],
        pinyin: "mǎ",
        characters: "马",
        collectionId: firstCollection,
        collectionName: "Animals",
        leitnerBox: 4,
        lastSession: dayjs().subtract(4, "day").toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Goat"],
        pinyin: "yáng",
        characters: "羊",
        collectionId: firstCollection,
        collectionName: "Animals",
        leitnerBox: 2,
        lastSession: dayjs().subtract(10, "day").toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Rooster"],
        pinyin: "gōng jī",
        characters: "公鸡",
        collectionId: firstCollection,
        collectionName: "Animals",
        leitnerBox: 4,
        lastSession: dayjs().subtract(10, "day").toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Dog"],
        pinyin: "gǒu",
        characters: "狗",
        collectionId: firstCollection,
        collectionName: "Animals",
        leitnerBox: 0,
        nextSession: defaultNextSession,
      },
    ]);

    const secondCollection = await this.cardCollections.add({
      label: "Numbers",
    });
    await this.cards.bulkAdd([
      {
        meanings: ["One", "First"],
        pinyin: "yī",
        characters: "一",
        collectionId: secondCollection,
        collectionName: "Numbers",
        leitnerBox: 3,
        lastSession: dayjs().toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Two"],
        pinyin: "èr",
        characters: "二",
        collectionId: secondCollection,
        collectionName: "Numbers",
        leitnerBox: 1,
        lastSession: dayjs().toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Three"],
        pinyin: "sān",
        characters: "三",
        collectionId: secondCollection,
        collectionName: "Numbers",
        leitnerBox: 3,
        lastSession: dayjs().toISOString(),
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Four"],
        pinyin: "sì",
        characters: "四",
        collectionId: secondCollection,
        collectionName: "Numbers",
        leitnerBox: 0,
        nextSession: defaultNextSession,
      },
      {
        meanings: ["Five"],
        pinyin: "wǔ",
        characters: "五",
        collectionId: secondCollection,
        collectionName: "Numbers",
        leitnerBox: 0,
        nextSession: defaultNextSession,
      },
    ]);
  }
}
