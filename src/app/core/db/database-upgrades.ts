import { Transaction } from "dexie";

type DbUpgrades = {
  [key: number]: (tx: Transaction) => Promise<unknown>;
};

export const upgrades: DbUpgrades = {
  1: () => Promise.resolve(),
  2: () => Promise.resolve(),
};
