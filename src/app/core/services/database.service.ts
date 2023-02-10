import { Injectable } from '@angular/core';
import { Database } from '../model/database.model';

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

  exportAsFile(): void {
    // TODO: export as CSV file
  }
}
