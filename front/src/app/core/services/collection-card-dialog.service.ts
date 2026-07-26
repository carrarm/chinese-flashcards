import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogConfig } from '@components/dialog/confirm-dialog/confirm-dialog.component';
import { CardCollection } from '@core/model/card-collection.model';
import { Card } from '@core/model/card.model';
import { CardEditorComponent } from '@pages/collection/card-editor/card-editor.component';
import { CardViewerComponent } from '@pages/collection/card-viewer/card-viewer.component';
import { CollectionEditorComponent } from '@pages/collection/collection-editor/collection-editor.component';
import { MoveCardDialogComponent } from '@pages/collection/move-card-dialog/move-card-dialog.component';
import { DialogData } from '@pages/collection/move-card-dialog/move-card-dialog.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollectionCardDialogService {
  private readonly dialog = inject(MatDialog);

  public openCardEditorDialog(collectionId: number, card?: Card): Observable<void> {
      return this.dialog
        .open(CardEditorComponent, {
          data: { card, collection: collectionId },
        })
        .afterClosed();
  }

  public openArchiveAllConfirmDialog(): Observable<boolean> {
      const data: ConfirmDialogConfig = {
        confirmText: "Archive selection",
        cancelText: "Forget it",
        title: "Archive selected cards",
        message:
          "The selected cards will be archived and won't appear during review sessions.",
        confirmType: "primary",
      };
      return this.dialog
        .open(ConfirmDialogComponent, { data })
        .afterClosed()
  }

  public openCardViewerDialog(card: Card, collectionId: number): Observable<void> {
      return this.dialog
        .open(CardViewerComponent, {
          data: { card, collection: collectionId },
        })
        .afterClosed();
  }

  public openCategoryEditorDialog(collection?: CardCollection): Observable<void> {
    return this.dialog
      .open(CollectionEditorComponent, {
        data: { collection },
      })
      .afterClosed();
  }

  public openMoveCardDialog(selectedCards: Card[], collectionId: number): Observable<boolean> {
    const data: DialogData = {
      cards: selectedCards,
      initialCategory: collectionId,
    };
    return this.dialog
      .open(MoveCardDialogComponent, { data })
      .afterClosed();
  }
}
