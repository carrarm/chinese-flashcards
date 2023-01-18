import { Injectable } from '@angular/core';
import { CardCollection } from '../model/card-collection.model';
import { collections } from './mocked-data';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor() {}

  getCollections(): CardCollection[] {
    return collections.sort((collection1, collection2) =>
      collection1.label.localeCompare(collection2.label)
    );
  }

  getCollection(id: number): CardCollection | undefined {
    return this.getCollections().find((collection) => collection.id === id);
  }
}
