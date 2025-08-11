import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  ConfirmDialogComponent,
  ConfirmDialogConfig,
} from "@components/dialog/confirm-dialog/confirm-dialog.component";
import { CardCollection } from "@core/model/card-collection.model";
import { Card } from "@core/model/card.model";
import { CardService } from "@core/services/card.service";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { normalizeForComparison, removeOnce } from "@core/utils/general.utils";
import { Subject, debounceTime } from "rxjs";
import { ActionTab, TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CardEditorComponent } from "../card-editor/card-editor.component";
import { CardViewerComponent } from "../card-viewer/card-viewer.component";
import { CollectionEditorComponent } from "../collection-editor/collection-editor.component";
import { MoveCardDialogComponent } from "../move-card-dialog/move-card-dialog.component";
import { DialogData } from "../move-card-dialog/move-card-dialog.types";
import { I18nPluralPipe, NgClass } from "@angular/common";
import { CardMeaningsPipe } from "@core/pipes/card-meanings.pipe";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { SOLID_ICONS } from "@core/font-awesome.config";

@Component({
  selector: "chf-collection-cards",
  imports: [
    CardMeaningsPipe,
    FontAwesomeModule,
    FormsModule,
    I18nPluralPipe,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    NgClass,
  ],
  templateUrl: "./collection-cards.component.html",
  styleUrls: ["./collection-cards.component.scss"],
})
export class CollectionCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly sort = viewChild.required(MatSort);
  protected readonly paginator = viewChild.required(MatPaginator);

  private readonly cardService = inject(CardService);
  private readonly collectionService = inject(CollectionService);
  private readonly dialog = inject(MatDialog);
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);
  private readonly settingsService = inject(SettingsService);
  private readonly tabBarService = inject(TabBarService);

  protected readonly columns = ["meanings", "pinyin", "characters"];
  protected readonly dataSource = new MatTableDataSource<Card>();
  protected readonly filter$ = new Subject<string | null>();

  protected readonly cardCountPlural = {
    "=0": "0 card",
    "=1": "1 card",
    other: "# cards",
  };

  protected filter = "";
  protected searchActive = false;
  protected collection?: CardCollection;
  protected pageSize = 20;
  protected multiselectActive = false;
  protected selectedCards: Card[] = [];

  private readonly tabBarActions: ActionTab[] = [
    {
      label: "Edit collection",
      icon: SOLID_ICONS.faEdit,
      action: () => this.openCategoryEditor(),
    },
    {
      label: "New card",
      icon: SOLID_ICONS.faAdd,
      action: () => this.openCardEditor(),
    },
  ];
  private readonly tabBarMultiselectActions: ActionTab[] = [
    {
      label: "Cancel",
      icon: SOLID_ICONS.faClose,
      action: () => this.stopMultiselect(),
    },
    {
      label: "Archive",
      icon: SOLID_ICONS.faBox,
      action: () => this.openArchiveAllConfirm(),
    },
    {
      label: "Move",
      icon: SOLID_ICONS.faShareFromSquare,
      action: () => this.openMoveCardDialog(),
    },
    {
      label: "Delete",
      icon: SOLID_ICONS.faTrash,
      action: () => this.openCardEditor(),
    },
  ];

  private collectionId = 0;

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.collectionId = +params["id"];
      this.loadCollectionCards();
      this.navigationService.navbarVisible.set(false);
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

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }

  public ngOnDestroy(): void {
    this.navigationService.navbarVisible.set(true);
  }

  protected openCardEditor(card?: Card): void {
    this.dialog
      .open(CardEditorComponent, {
        data: { card, collection: this.collectionId },
      })
      .afterClosed()
      .subscribe(() => this.loadCollectionCards());
  }

  protected rowClicked(card: Card): void {
    if (this.multiselectActive) {
      this.handleRowSelection(card);
    } else {
      this.openCardViewer(card);
    }
  }

  protected toggleSearch(): void {
    this.searchActive = !this.searchActive;
    if (!this.searchActive) {
      this.filter = "";
      this.filter$.next(null);
    }
  }

  protected clearSearchBar(): void {
    this.filter = "";
    this.filter$.next(null);
  }

  protected startMultiselect(): void {
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
        return normalizeForComparison(columnData[0].toLocaleLowerCase());
      }
      if (typeof columnData === "string") {
        return normalizeForComparison(columnData.toLocaleLowerCase());
      }
      throw "Unhandled data type: only meanings and pinyin column should be sorted";
    };
  }

  private openArchiveAllConfirm(): void {
    const data: ConfirmDialogConfig = {
      confirmText: "Archive selection",
      cancelText: "Forget it",
      title: "Archive selected cards",
      message:
        "The selected cards will be archived and won't appear during review sessions.",
      confirmType: "primary",
    };
    this.dialog
      .open(ConfirmDialogComponent, { data })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.selectedCards.forEach((card) => (card.archived = true));
          this.cardService
            .updateCards(this.selectedCards)
            .then(() => this.loadCollectionCards());
        }
      });
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
