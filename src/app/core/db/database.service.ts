import { Injectable } from '@angular/core';
import { downloadFile } from '../utils/file.utils';
import { Database } from './database.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  public readonly database = new Database();

  constructor() {
    this.database.open();
  }

  syncWithCloud(): void {
    // TODO: synchronize with Dexie cloud
  }

  async exportAsFile(): Promise<void> {
    const collections = await this.database.cardCollections.toArray();
    const cards = await this.database.cards.toArray();
    const settings = await this.database.settings.toCollection().first();

    const collectionsBackup = collections.map((collection) => ({
      ...collection,
      cards: cards.filter((card) => card.collectionId === collection.id),
    }));

    const backup = { settings, collections: collectionsBackup };
    downloadFile('chinese-flashcards-backup.json', JSON.stringify(backup));
  }

  clearDatabase(): Promise<unknown> {
    return this.database.deleteAndRebuild();
  }
}
