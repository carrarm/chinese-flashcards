import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CardCollection } from "@core/model/card-collection.model";
import { CollectionService } from "@core/services/collection.service";
import { NavigationService } from "@core/services/navigation.service";
import { TabBarService } from "src/app/components/tab-bar/tab-bar.service";
import { CollectionEditorComponent } from "../collection-editor/collection-editor.component";

@Component({
  selector: "chf-collection-list",
  templateUrl: "./collection-list.component.html",
  styleUrls: ["./collection-list.component.scss"],
})
export class CollectionListComponent implements OnInit {
  public collections: CardCollection[] = [];
  public cardCountPlural = {
    "=0": "No card",
    "=1": "1 card",
    other: "# cards",
  };

  constructor(
    private collectionService: CollectionService,
    private navigationService: NavigationService,
    private tabBarService: TabBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCollections();
    this.navigationService.setTitle("Manage collections");
    this.navigationService.resetNavbarText();
    this.tabBarService.resetTabBar();
  }

  openEditor(collection?: CardCollection): void {
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
