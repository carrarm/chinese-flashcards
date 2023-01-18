import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'src/app/core/model/card.model';
import { CollectionService } from 'src/app/core/services/collection.service';
import { CardEditorComponent } from '../card-editor/card-editor.component';

@Component({
  selector: 'chf-collection-cards',
  templateUrl: './collection-cards.component.html',
  styleUrls: ['./collection-cards.component.scss'],
})
export class CollectionCardsComponent implements OnInit {
  public cards: Card[] = [];
  public columns = ['meanings', 'pinyin', 'characters'];

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.cards =
        this.collectionService.getCollection(+params['id'])?.cards ?? [];
      console.log(this.cards);
    });
  }

  openEditor(card?: Card): void {
    this.dialog.open(CardEditorComponent, {
      data: card,
      panelClass: ['mat-app-background', 'dark-mode'],
    });
  }
}
