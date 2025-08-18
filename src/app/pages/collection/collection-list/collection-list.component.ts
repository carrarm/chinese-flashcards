import { Component, inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CardCollection } from "@core/model/card-collection.model";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CollectionEditorComponent } from "../collection-editor/collection-editor.component";
import { ButtonComponent } from "@components/button/button.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { CardComponent } from "@components/card/card.component";
import { RouterModule } from "@angular/router";
import { I18nPluralPipe } from "@angular/common";

@Component({
  selector: "chf-collection-list",
  imports: [
    ButtonComponent,
    CardComponent,
    FaIconComponent,
    I18nPluralPipe,
    RouterModule,
  ],
  templateUrl: "./collection-list.component.html",
  styleUrls: ["./collection-list.component.scss"],
})
export class CollectionListComponent implements OnInit {
  protected readonly cardCountPlural = {
    "=0": "No card",
    "=1": "1 card",
    other: "# cards",
  };

  private readonly collectionService = inject(CollectionService);
  private readonly navigationService = inject(NavigationService);
  private readonly tabBarService = inject(TabBarService);
  private readonly dialog = inject(MatDialog);

  public collections: CardCollection[] = [];

  public ngOnInit(): void {
    this.loadCollections();
    this.navigationService.setTitle("Manage collections");
    this.navigationService.resetNavbarText();
    this.tabBarService.resetTabBar();
  }

  protected openEditor(collection?: CardCollection): void {
    this.dialog
      .open(CollectionEditorComponent, {
        data: { collection },
        panelClass: [],
      })
      .afterClosed()
      .subscribe(() => this.loadCollections());
  }

  private loadCollections(): void {
    this.collectionService
      .getCollections()
      .then((collections) => (this.collections = collections));
  }
}
