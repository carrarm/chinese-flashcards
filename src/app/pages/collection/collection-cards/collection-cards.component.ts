import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { CardCollection } from "@core/model/card-collection.model";
import { Card } from "@core/model/card.model";
import { CardMeaningsPipe } from "@core/pipes/card-meanings.pipe";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
import { TableColumn, TableRow } from "src/app/components/data-table/data-table.types";
import { CardEditorComponent } from "../card-editor/card-editor.component";

@Component({
  selector: "chf-collection-cards",
  templateUrl: "./collection-cards.component.html",
  styleUrls: ["./collection-cards.component.scss"],
})
export class CollectionCardsComponent implements OnInit, OnDestroy {
  public icons = {
    goBack: faChevronLeft,
  };

  public columns: TableColumn<Card>[] = [
    {
      label: "Meanings",
      fieldName: "meanings",
      displayFunction: (row) => this.cardMeaningsPipe.transform(row.data.meanings),
    },
    { label: "Pinyin", fieldName: "pinyin", cssClass: "pinyin-column" },
    { label: "Chinese", fieldName: "characters" },
  ];
  public tableRows: TableRow<Card>[] = [];

  public filter$ = new Subject<string | null>();
  public filter = "";
  public searchActive = false;
  public collectionName = "Collection";
  public collection?: CardCollection;
  public pageSize = 20;
  public cardCountPlural = {
    "=0": "0 card",
    "=1": "1 card",
    other: "# cards",
  };

  private collectionId = 0;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private dialog: MatDialog,
    private navigationService: NavigationService,
    private settingsService: SettingsService,
    private cardMeaningsPipe: CardMeaningsPipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.collectionId = +params["id"];
      this.loadCollectionCards();
      this.navigationService.navbarVisible.next(false);
    });

    this.settingsService
      .getSettings()
      .then((settings) => (this.pageSize = settings.pageSize));

    // this.filter$
    //   .pipe(debounceTime(250))
    //   .subscribe(() => (this.dataSource.filter = this.filter));
  }

  ngOnDestroy(): void {
    this.navigationService.navbarVisible.next(true);
  }

  openEditor(card?: Card): void {
    this.dialog
      .open(CardEditorComponent, {
        data: { card, collection: this.collectionId },
        panelClass: ["mat-app-background", "dark-mode"],
      })
      .afterClosed()
      .subscribe(() => this.loadCollectionCards());
  }

  toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (!this.searchActive) {
      this.filter = "";
      this.filter$.next(null);
    }
  }

  private loadCollectionCards(): void {
    this.collectionService.getCollection(this.collectionId).then((collection) => {
      if (collection) {
        this.collection = collection;
        this.collectionName = collection.label;
        this.navigationService.setTitle("Manage collections - " + this.collectionName);
        this.updateRows(collection.cards);
      }
    });
  }

  private updateRows(collection: Card[]): void {
    this.tableRows = collection.map((card) => {
      const row: TableRow<Card> = { data: card };
      Object.keys(card).forEach((key) => {
        const cardKey = key as keyof Card;
        row[key] = card[cardKey];
      });
      return row;
    });
    // this.dataSource.filterPredicate = (card: Card, filter: string) => {
    //   const normalizedFilter = normalizeForComparison(filter);
    //   const normalizedContent: string[] = card.meanings.map((meaning) =>
    //     normalizeForComparison(meaning)
    //   );
    // if (card.pinyin) {
    //     normalizedContent.push(normalizeForComparison(card.pinyin));
    //   }
    //   return normalizedContent.some((content) => content.includes(normalizedFilter));
    // };
    // this.dataSource.sortingDataAccessor = (data: Card, sortHeaderId: string): string => {
    //   const columnData = data[sortHeaderId as keyof Card];
    //   if (Array.isArray(columnData)) {
    //     return columnData[0].toLocaleLowerCase();
    //   }
    //   if (typeof columnData === "string") {
    //     return columnData.toLocaleLowerCase();
    //   }
    //   throw "Unhandled data type: only meanings and pinyin column should be sorted";
    // };
  }
}
