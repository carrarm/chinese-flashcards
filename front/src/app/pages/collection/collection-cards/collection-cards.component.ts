import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { SOLID_ICONS } from "@core/font-awesome.config";
import { ALL_CARDS_COLLECTION_ID, CardCollection } from "@core/model/card-collection.model";
import { Card } from "@core/model/card.model";
import { CardMeaningsPipe } from "@core/pipes/card-meanings.pipe";
import { CardService } from "@core/services/card.service";
import { CollectionCardDialogService } from "@core/services/collection-card-dialog.service";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { normalizeForComparison, removeOnce } from "@core/utils/general.utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ActionTab, TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CardSearchComponent } from "./card-search/card-search.component";
import { CollectionHeaderComponent } from "./collection-header/collection-header.component";

@Component({
  selector: "chf-collection-cards",
  imports: [
    CardMeaningsPipe,
    FontAwesomeModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterModule,
    CollectionHeaderComponent,
    CardSearchComponent,
  ],
  templateUrl: "./collection-cards.component.html",
  styleUrls: ["./collection-cards.component.scss"],
})
export class CollectionCardsComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly sort = viewChild.required(MatSort);
  protected readonly paginator = viewChild.required(MatPaginator);

  private readonly cardService = inject(CardService);
  private readonly collectionService = inject(CollectionService);
  private readonly navigationService = inject(NavigationService);
  private readonly route = inject(ActivatedRoute);
  private readonly settingsService = inject(SettingsService);
  private readonly tabBarService = inject(TabBarService);
  private readonly collectionCardDialogService = inject(CollectionCardDialogService);

  protected readonly columns = ["meanings", "pinyin", "characters"];
  protected readonly dataSource = new MatTableDataSource<Card>();

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
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort();
    this.dataSource.paginator = this.paginator();
  }

  public ngOnDestroy(): void {
    this.navigationService.navbarVisible.set(true);
  }

  protected openCardEditor(card?: Card): void {
    this.collectionCardDialogService
      .openCardEditorDialog(this.collectionId, card)
      .subscribe(() => this.loadCollectionCards());
  }

  protected rowClicked(card: Card): void {
    if (this.multiselectActive) {
      this.handleRowSelection(card);
    } else {
      this.openCardViewer(card);
    }
  }

  protected onFilterChange(value: string | null): void {
    this.dataSource.filter = value ?? "";
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

  private async loadCollectionCards(): Promise<void> {
    this.stopMultiselect();
    let collection: CardCollection | undefined;
    if (this.collectionId !== ALL_CARDS_COLLECTION_ID) {
      collection = await this.collectionService.getCollection(this.collectionId);
   } else {
     const collections = await this.collectionService.getCollections();
       collection = new CardCollection({
         id: ALL_CARDS_COLLECTION_ID,
         label: "All collections",
       });
       collection.cards = collections.flatMap((collection) => collection.cards);
    };
    if (!collection) {
      return;
    }
    this.collection = collection;
    this.navigationService.setTitle("Manage collections - " + collection.label);
    this.dataSource.data = collection.cards;
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
    this.collectionCardDialogService
      .openArchiveAllConfirmDialog()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.selectedCards.forEach((card) => (card.archived = 1));
          this.cardService
            .updateCards(this.selectedCards)
            .then(() => this.loadCollectionCards());
        }
      });
  }

  private openCardViewer(card: Card): void {
    this.collectionCardDialogService
      .openCardViewerDialog(card, this.collectionId)
      .subscribe(() => this.loadCollectionCards());
  }

  private openCategoryEditor(): void {
    this.collectionCardDialogService
      .openCategoryEditorDialog(this.collection)
      .subscribe(() =>
        this.collectionService
          .getCollection(this.collectionId)
          .then((refreshedCollection) => (this.collection = refreshedCollection))
      );
  }

  private openMoveCardDialog(): void {
    this.collectionCardDialogService
      .openMoveCardDialog(this.selectedCards, this.collectionId)
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
