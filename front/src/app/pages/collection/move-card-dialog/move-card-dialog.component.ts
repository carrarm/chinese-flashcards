import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CardCollection } from "@core/model/card-collection.model";
import { CardService } from "@core/services/card.service";
import { CollectionService } from "@core/services/collection.service";
import { ToasterService } from "@core/services/toaster.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DialogData } from "./move-card-dialog.types";

@Component({
  selector: "chf-move-card-dialog",
  imports: [
    ButtonComponent,
    CommonModule,
    FontAwesomeModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: "./move-card-dialog.component.html",
  styleUrl: "./move-card-dialog.component.scss",
})
export class MoveCardDialogComponent implements OnInit {
  protected readonly cardPlural = {
    "=1": "Move 1 card",
    other: "Move # cards",
  };

  protected readonly data: DialogData = inject(MAT_DIALOG_DATA);

  private readonly cardService = inject(CardService);
  private readonly collectionService = inject(CollectionService);
  private readonly dialogRef = inject(MatDialogRef<MoveCardDialogComponent>);
  private readonly toaster = inject(ToasterService);

  protected collections: CardCollection[] = [];
  protected targetCollection?: CardCollection;

  public ngOnInit(): void {
    this.collectionService
      .getCollections(false)
      .then(
        (collections) =>
          (this.collections = collections.filter(
            (c) => c.id !== this.data.initialCategory
          ))
      );
  }

  protected moveCards(): void {
    if (!this.targetCollection) {
      this.toaster.error("No collection selected");
      return;
    }

    const updatedCards = this.data.cards.map((c) => c.clone());
    updatedCards.forEach((card) => {
      card.collectionId = this.targetCollection!.id;
    });
    this.cardService.updateCards(updatedCards);

    this.toaster.info(
      `${updatedCards.length} card(s) moved to ${this.targetCollection.label}`
    );

    this.dialogRef.close(true);
  }
}
