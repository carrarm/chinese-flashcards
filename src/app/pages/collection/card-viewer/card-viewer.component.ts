import { Component, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { ButtonComponent } from "@components/button/button.component";
import { CardComponent } from "@components/card/card.component";
import { InlineConfirmDialogComponent } from "@components/dialog/inline-confirm-dialog/inline-confirm-dialog.component";
import { Card } from "@core/model/card.model";
import { CardMeaningsPipe } from "@core/pipes/card-meanings.pipe";
import { CardService } from "@core/services/card.service";
import { CardDifficultyComponent } from "../../shared/components/card-difficulty/card-difficulty.component";
import { CardEditorComponent } from "../card-editor/card-editor.component";
import { CardProgressBarComponent } from "./card-progress-bar/card-progress-bar.component";

@Component({
  standalone: true,
  imports: [
    ButtonComponent,
    CardComponent,
    CardDifficultyComponent,
    CardMeaningsPipe,
    CardProgressBarComponent,
    InlineConfirmDialogComponent,
    MatDialogModule,
    MatDividerModule,
  ],
  selector: "chf-card-viewer",
  templateUrl: "./card-viewer.component.html",
  styleUrls: ["./card-viewer.component.scss"],
})
export class CardViewerComponent {
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
