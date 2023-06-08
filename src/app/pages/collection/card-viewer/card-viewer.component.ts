import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Card } from "@core/model/card.model";
import { CardService } from "@core/services/card.service";
import {
  faClose,
  faEdit,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { CardEditorComponent } from "../card-editor/card-editor.component";

@Component({
  selector: "chf-card-viewer",
  templateUrl: "./card-viewer.component.html",
  styleUrls: ["./card-viewer.component.scss"],
})
export class CardViewerComponent {
  public icons = {
    close: faClose,
    edit: faEdit,
    delete: faTrash,
    reset: faRotateLeft,
  };
  public card: Card;
  public isDeleteConfirm = false;
  public isResetConfirm = false;
  public isEditActive = false;

  private collectionId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card: Card; collection: number },
    public dialogRef: MatDialogRef<CardViewerComponent>,
    private cardService: CardService,
    private dialog: MatDialog
  ) {
    this.card = data.card;
    this.collectionId = data.collection;
  }

  public editCard(): void {
    this.isEditActive = true;
    this.dialog
      .open(CardEditorComponent, {
        data: {
          card: this.card,
          collection: this.collectionId,
        },
      })
      .afterClosed()
      .subscribe(async () => {
        this.isEditActive = false;
        this.card = await this.cardService.getCard(this.card.id ?? 0);
      });
  }

  public async deleteCard(): Promise<void> {
    await this.cardService.deleteCard(this.card);
    this.dialogRef.close();
  }

  public async resetProgress(): Promise<void> {
    let updatedCard = this.card.clone();
    updatedCard.reset();
    updatedCard = await this.cardService.updateCard(updatedCard);
    this.card = updatedCard;
    this.isResetConfirm = false;
  }
}
