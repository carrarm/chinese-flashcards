import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { CardCollection } from "@core/model/card-collection.model";
import { Card } from "@core/model/card.model";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { normalizeForComparison } from "@core/utils/general.utils";
import {
  faAdd,
  faChevronLeft,
  faClose,
  faEdit,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Subject, debounceTime } from "rxjs";
import { ActionTab, TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CardEditorComponent } from "../card-editor/card-editor.component";
import { CollectionEditorComponent } from "../collection-editor/collection-editor.component";

@Component({
  selector: "chf-collection-cards",
  templateUrl: "./collection-cards.component.html",
  styleUrls: ["./collection-cards.component.scss"],
})
export class CollectionCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  public icons = {
    goBack: faChevronLeft,
    search: faMagnifyingGlass,
    clear: faClose,
  };

  public columns = ["meanings", "pinyin", "characters"];
  public dataSource = new MatTableDataSource<Card>();
  public filter$ = new Subject<string | null>();
  public filter = "";
  public searchActive = false;
  public collection?: CardCollection;
  public pageSize = 20;
  public cardCountPlural = {
    "=0": "0 card",
    "=1": "1 card",
    other: "# cards",
  };

  private collectionId = 0;
  private readonly tabBarActions: ActionTab[] = [
    {
      label: "Edit collection",
      icon: faEdit,
      action: () => this.openCategoryEditor(),
    },
    {
      label: "New card",
      icon: faAdd,
      action: () => {
        /* TODO */
      },
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private tabBarService: TabBarService,
    private dialog: MatDialog,
    private navigationService: NavigationService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.collectionId = +params["id"];
      this.loadCollectionCards();
      this.navigationService.navbarVisible.next(false);
      this.tabBarService.setActions(this.tabBarActions);
    });

    this.settingsService
      .getSettings()
      .then((settings) => (this.pageSize = settings.pageSize));

    this.initializeDataSource();

    this.filter$
      .pipe(debounceTime(250))
      .subscribe(() => (this.dataSource.filter = this.filter));
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort ?? null;
    this.dataSource.paginator = this.paginator ?? null;
  }

  ngOnDestroy(): void {
    this.navigationService.navbarVisible.next(true);
  }

  openCardEditor(card?: Card): void {
    this.dialog
      .open(CardEditorComponent, {
        data: { card, collection: this.collectionId },
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

  clearSearchBar(): void {
    this.filter = "";
    this.filter$.next(null);
  }

  private loadCollectionCards(): void {
    this.collectionService.getCollection(this.collectionId).then((collection) => {
      if (collection) {
        this.collection = collection;
        this.navigationService.setTitle("Manage collections - " + collection.label);
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
      return normalizedContent.some((content) => content.includes(normalizedFilter));
    };

    this.dataSource.sortingDataAccessor = (data: Card, sortHeaderId: string): string => {
      const columnData = data[sortHeaderId as keyof Card];
      if (Array.isArray(columnData)) {
        return columnData[0].toLocaleLowerCase();
      }
      if (typeof columnData === "string") {
        return columnData.toLocaleLowerCase();
      }
      throw "Unhandled data type: only meanings and pinyin column should be sorted";
    };
  }

  private openCategoryEditor(): void {
    this.dialog
      .open(CollectionEditorComponent, {
        data: { collection: this.collection },
      })
      .afterClosed()
      .subscribe(() =>
        this.collectionService
          .getCollection(this.collectionId)
          .then((refreshedCollection) => (this.collection = refreshedCollection))
      );
  }
}
