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
import { normalizeForComparison, removeOnce } from "@core/utils/general.utils";
import {
  faAdd,
  faClose,
  faEdit,
  faShareFromSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Subject, debounceTime } from "rxjs";
import { ActionTab, TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CardEditorComponent } from "../card-editor/card-editor.component";
import { CardViewerComponent } from "../card-viewer/card-viewer.component";
import { CollectionEditorComponent } from "../collection-editor/collection-editor.component";
import { MoveCardDialogComponent } from "../move-card-dialog/move-card-dialog.component";
import { DialogData } from "../move-card-dialog/move-card-dialog.types";

@Component({
  selector: "chf-collection-cards",
  templateUrl: "./collection-cards.component.html",
  styleUrls: ["./collection-cards.component.scss"],
})
export class CollectionCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

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
  public multiselectActive = false;
  public selectedCards: Card[] = [];

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
      action: () => this.openCardEditor(),
    },
  ];
  private readonly tabBarMultiselectActions: ActionTab[] = [
    {
      label: "Cancel",
      icon: faClose,
      action: () => this.stopMultiselect(),
    },
    {
      label: "Move",
      icon: faShareFromSquare,
      action: () => this.openMoveCardDialog(),
    },
    {
      label: "Delete",
      icon: faTrash,
      action: () => this.openCardEditor(),
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

  rowClicked(card: Card): void {
    if (this.multiselectActive) {
      this.handleRowSelection(card);
    } else {
      this.openCardViewer(card);
    }
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

  startMultiselect(): void {
    this.multiselectActive = true;
    this.tabBarService.setActions(this.tabBarMultiselectActions);
  }

  private handleRowSelection(card: Card): void {
    if (this.selectedCards.includes(card)) {
      removeOnce(this.selectedCards, card);
      if (this.selectedCards.length === 0) {
        this.stopMultiselect();
      }
    } else {
      this.selectedCards.push(card);
    }
  }

  private loadCollectionCards(): void {
    this.stopMultiselect();
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

  private openCardViewer(card: Card): void {
    this.dialog
      .open(CardViewerComponent, {
        data: { card, collection: this.collectionId },
      })
      .afterClosed()
      .subscribe(() => this.loadCollectionCards());
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

  private openMoveCardDialog(): void {
    const data: DialogData = {
      cards: this.selectedCards,
      initialCategory: this.collectionId,
    };
    this.dialog
      .open(MoveCardDialogComponent, { data })
      .afterClosed()
      .subscribe((refreshNeeded) => {
        if (refreshNeeded) {
          this.loadCollectionCards();
        }
      });
  }

  private stopMultiselect(): void {
    this.selectedCards = [];
    this.multiselectActive = false;
    this.tabBarService.setActions(this.tabBarActions);
  }
}
