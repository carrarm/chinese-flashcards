import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CardCollection } from 'src/app/core/model/card-collection.model';
import { CollectionService } from 'src/app/core/services/collection.service';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'chf-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  public collections: CardCollection[] = [];
  public cardCountPlural = {
    '=0': 'No card',
    '=1': '1 card',
    other: '# cards',
  };

  constructor(
    private collectionService: CollectionService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.collections = this.collectionService.getCollections();
    this.navigationService.setTitle('Manage collections');
  }
}
