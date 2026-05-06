import { CardCollection } from "@core/model/card-collection.model";
import { boxReviewDelay, CardModel, defaultNextSession } from "@core/model/card.model";
import dayjs from "dayjs";
import { Transaction } from "dexie";

type DbUpgrades = {
  [key: number]: (tx: Transaction) => Promise<unknown>;
};

/**
 * IndexDB "update scripts" based on the current version.
 */
export const upgrades: DbUpgrades = {
  1: () => Promise.resolve(),
  2: () => Promise.resolve(),
  3: async (tx: Transaction) => {
    const cards = tx.table<CardModel>("cards");
    const collectionTable = tx.table<CardCollection>("cardCollections");

    const collections = await collectionTable.toArray();
    const collectionMap = new Map(collections.map((collection) => [collection.id, collection.label]));

    await cards.toCollection().modify((card) => {
      card.collectionName = collectionMap.get(card.collectionId);
      card.archived = card.archived === undefined ? 0 : 1;
      
      if (card.lastSession && card.leitnerBox > 0) {
        const delay = boxReviewDelay[card.leitnerBox];
        card.nextSession = dayjs(card.lastSession).add(delay, "day").toISOString();
      } else {
        card.nextSession = defaultNextSession;
      }
    });
  },
};
