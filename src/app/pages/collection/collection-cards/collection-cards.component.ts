import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, never, Subject } from 'rxjs';
import { Card } from 'src/app/core/model/card.model';
import { CollectionService } from 'src/app/core/services/collection.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { normalizeForComparison } from 'src/app/core/utils/general.utils';
import { CardEditorComponent } from '../card-editor/card-editor.component';

@Component({
  selector: 'chf-collection-cards',
  templateUrl: './collection-cards.component.html',
  styleUrls: ['./collection-cards.component.scss'],
})
export class CollectionCardsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public columns = ['meanings', 'pinyin', 'characters'];
  public dataSource = new MatTableDataSource<Card>();
  public filter$ = new Subject<string | null>();
  public filter = '';
  public searchActive = false;
  public collectionName = 'Collection';

  private collectionId = 0;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private dialog: MatDialog,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.collectionId = +params['id'];
      this.loadCollectionCards();
    });

    this.initializeDataSource();

    this.filter$
      .pipe(debounceTime(250))
      .subscribe(() => (this.dataSource.filter = this.filter));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort ?? null;
    this.dataSource.paginator = this.paginator ?? null;
  }

  openEditor(card?: Card): void {
    this.dialog
      .open(CardEditorComponent, {
        data: { card, collection: this.collectionId },
        panelClass: ['mat-app-background', 'dark-mode'],
      })
      .afterClosed()
      .subscribe(() => this.loadCollectionCards());
  }

  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (!this.searchActive) {
      this.filter = '';
      this.filter$.next(null);
    }
  }

  private loadCollectionCards(): void {
    this.collectionService
      .getCollection(this.collectionId)
      .then((collection) => {
        if (collection) {
          this.collectionName = collection.label;
          this.navigationService.setTitle(
            'Manage collections - ' + this.collectionName
          );
          this.dataSource.data = collection.cards;
        }
      });
  }

  private initializeDataSource(): void {
    this.dataSource.filterPredicate = (card: Card, filter: string) => {
      const normalizedFilter = normalizeForComparison(filter);
      const normalizedContent: string[] = card.meanings.map((meaning) =>
        normalizeForComparison(meaning)
      );
      if (card.pinyin) {
        normalizedContent.push(normalizeForComparison(card.pinyin));
      }
      return normalizedContent.some((content) =>
        content.includes(normalizedFilter)
      );
    };

    this.dataSource.sortingDataAccessor = (
      data: Card,
      sortHeaderId: string
    ): string => {
      const columnData = data[sortHeaderId as keyof Card];
      if (Array.isArray(columnData)) {
        return columnData[0].toLocaleLowerCase();
      }
      if (typeof columnData === 'string') {
        return columnData.toLocaleLowerCase();
      }
      throw 'Unhandled data type: only meanings and pinyin column should be sorted';
    };
  }
}
