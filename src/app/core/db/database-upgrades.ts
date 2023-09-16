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
};
