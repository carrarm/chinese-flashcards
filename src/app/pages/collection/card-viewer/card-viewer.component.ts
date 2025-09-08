import { Component, inject } from "@angular/core";
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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CardDifficultyComponent } from "../../shared/components/card-difficulty/card-difficulty.component";
import { CardEditorComponent } from "../card-editor/card-editor.component";
import { CardProgressBarComponent } from "./card-progress-bar/card-progress-bar.component";

@Component({
  imports: [
    ButtonComponent,
    CardComponent,
    CardDifficultyComponent,
    CardMeaningsPipe,
    CardProgressBarComponent,
    FontAwesomeModule,
    InlineConfirmDialogComponent,
    MatDialogModule,
    MatDividerModule,
  ],
  selector: "chf-card-viewer",
  templateUrl: "./card-viewer.component.html",
  styleUrls: ["./card-viewer.component.scss"],
})
export class CardViewerComponent {
  protected readonly dialogRef = inject(MatDialogRef<CardViewerComponent>);
  private readonly data: { card: Card; collection: number } = inject(MAT_DIALOG_DATA);
  private readonly cardService = inject(CardService);
  private readonly dialog = inject(MatDialog);

  protected card = this.data.card;
  protected isEditActive = false;
  protected openedConfirmDialog?: "delete" | "reset" | "archive";

  protected async deleteCard(): Promise<void> {
    await this.cardService.deleteCard(this.card);
    this.dialogRef.close();
  }

  protected editCard(): void {
    this.isEditActive = true;
    this.dialog
      .open(CardEditorComponent, {
        data: {
          card: this.card,
          collection: this.data.collection,
        },
      })
      .afterClosed()
      .subscribe(async () => {
        this.isEditActive = false;
        this.card = await this.cardService.getCard(this.card.id ?? 0);
      });
  }

  protected async resetProgress(): Promise<void> {
    let updatedCard = this.card.clone();
    updatedCard.reset();
    updatedCard = await this.cardService.updateCard(updatedCard);
    this.card = updatedCard;
    this.openedConfirmDialog = undefined;
  }

  protected async toggleArchivedCard(): Promise<void> {
    this.card.archived = !this.card.archived;
    this.card = await this.cardService.updateCard(this.card);
    this.openedConfirmDialog = undefined;
  }
}
