import { Component, inject } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { saveAs } from "file-saver";

import { ButtonComponent } from "@components/button/button.component";
import { FileUploadComponent } from "@components/file-upload/file-upload.component";
import { Card } from "@core/model/card.model";
import { CardCollection } from "@core/model/card-collection.model";
import { VocabularySheetParser, VocabSheetTuple } from "@core/utils/excel-parser.utils";
import { CardService } from "@core/services/card.service";
import { CollectionService } from "@core/services/collection.service";

type CardUpdate = { card: Card; status: "updated" | "created" };

@Component({
  selector: "chf-excel-import-dialog",
  imports: [
    ButtonComponent,
    FaIconComponent,
    FileUploadComponent,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: "./excel-import-dialog.component.html",
  styleUrl: "./excel-import-dialog.component.scss",
})
export class ExcelImportDialogComponent {
  private readonly cardService = inject(CardService);
  private readonly collectionService = inject(CollectionService);
  private readonly dialogRef = inject(MatDialogRef<ExcelImportDialogComponent>);
  private readonly snackbar = inject(MatSnackBar);

  protected fileToImport?: File;
  protected importInProgress = false;
  protected parsingErrors: string[] = [];
  protected textExpanded = false;

  protected downloadTemplate(): void {
    saveAs("assets/vocabulary-sheet-template.xlsx", "vocabulary-sheet-template.xlsx");
  }

  protected importFile(): void {
    if (this.fileToImport) {
      this.importInProgress = true;
      VocabularySheetParser.parse(this.fileToImport)
        .then(async (result) => {
          this.parsingErrors = result.parsingErrors;
          if (!result.parsingErrors.length) {
            const promises: Promise<CardUpdate>[] = [];
            for (const sheetName in result.sheets) {
              const collection = await this.getCollection(sheetName);
              for (const tuple of result.sheets[sheetName]) {
                promises.push(this.createOrUpdateCard(collection, tuple));
              }
            }

            Promise.all(promises).then((cards) => {
              const totalCreated = cards.reduce(
                (acc, card) => acc + (card.status === "created" ? 1 : 0),
                0
              );
              const totalUpdated = cards.length - totalCreated;
              this.snackbar.open(
                `Vocabulary imported successfully (${totalCreated} created, ${totalUpdated} updated)`,
                "Close"
              );
              this.dialogRef.close();
            });
          }
        })
        .catch((error) => {
          console.error(error);
          this.snackbar.open("An error occurrent during the import", "Close");
        })
        .finally(() => (this.importInProgress = false));
    }
  }

  private async getCollection(collectionName: string): Promise<CardCollection> {
    let collection = await this.collectionService.getCollectionByName(collectionName);
    if (!collection) {
      const collectionId = await this.collectionService.createCollection({
        label: collectionName,
      });
      collection = await this.collectionService.getCollection(collectionId);
    }
    return collection as CardCollection;
  }

  private async createOrUpdateCard(
    collection: CardCollection,
    tuple: VocabSheetTuple
  ): Promise<CardUpdate> {
    const meanings = tuple.meanings.split("\n");
    const matchingCard = await this.cardService.findCard(collection.id, { meanings });
    let savedCard: Card;
    let status: "updated" | "created";
    if (matchingCard) {
      if (
        matchingCard.characters !== tuple.characters ||
        matchingCard.pinyin !== tuple.pinyin
      ) {
        matchingCard.reset();
      }
      matchingCard.characters = tuple.characters;
      matchingCard.pinyin = tuple.pinyin;
      savedCard = await this.cardService.updateCard(matchingCard);
      status = "updated";
    } else {
      savedCard = await this.cardService.createCard(
        new Card({
          ...tuple,
          meanings,
          leitnerBox: 0,
          collectionId: 0,
        }),
        collection.id
      );
      status = "created";
    }
    return { card: savedCard, status };
  }
}
