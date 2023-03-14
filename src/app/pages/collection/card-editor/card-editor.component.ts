import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Card } from "src/app/core/model/card.model";
import { CardService } from "src/app/core/services/card.service";
import { SettingsService } from "src/app/core/services/settings.service";
import { toOptional } from "src/app/core/utils/form.utils";

interface CardForm {
  meaning: FormControl<string | null>;
  pinyin: FormControl<string | null>;
  chinese: FormControl<string | null>;
}

@Component({
  selector: "chf-card-editor",
  templateUrl: "./card-editor.component.html",
  styleUrls: ["./card-editor.component.scss"],
})
export class CardEditorComponent {
  public keepEditorOpen = false;
  public virtualKeyboardOpen = false;
  public creationMode = true;

  public form = new FormGroup<CardForm>({
    meaning: new FormControl<string | null>(null, Validators.required),
    pinyin: new FormControl<string | null>(null),
    chinese: new FormControl<string | null>(null),
  });
  public resetProgressActive = false;

  private collectionId: number;
  private originalCard?: Card;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card?: Card; collection: number },
    public dialogRef: MatDialogRef<CardEditorComponent>,
    private cardService: CardService,
    settingsService: SettingsService
  ) {
    if (data.card) {
      this.form.patchValue({
        meaning: data.card.meanings.join(" ; "),
        pinyin: data.card.pinyin,
        chinese: data.card.characters,
      });
      this.creationMode = false;
      this.originalCard = data.card;
    }
    this.collectionId = data.collection;
    settingsService.getSettings().then((settings) => {
      if (settings.resetCardProgress && !this.creationMode) {
        this.trackChanges();
      }
    });
  }

  public async saveCard(): Promise<void> {
    const { meaning, chinese, pinyin } = this.form.value;
    if (meaning && (chinese || pinyin)) {
      const card: Card = new Card({
        meanings: meaning.split(";").map((m) => m.trim()),
        pinyin: toOptional(pinyin),
        characters: toOptional(chinese),
        collectionId: this.collectionId,
        id: this.originalCard?.id,
        leitnerBox: this.originalCard?.leitnerBox ?? 0,
        lastSession: this.originalCard?.lastSession,
      });

      if (this.resetProgressActive) {
        card.leitnerBox = 0;
        card.lastSession = undefined;
      }

      const savePromise = this.creationMode
        ? this.cardService.createCard(card, this.collectionId)
        : this.cardService.updateCard(card);

      await savePromise;
      if (this.keepEditorOpen) {
        this.form.reset();
      } else {
        this.dialogRef.close();
      }
    }
  }

  public async deleteCard(): Promise<void> {
    if (this.originalCard?.id) {
      await this.cardService.deleteCard(this.originalCard.id);
    }
    this.dialogRef.close();
  }

  private trackChanges(): void {
    this.form.valueChanges.subscribe((formValues) => {
      this.resetProgressActive =
        formValues.chinese !== this.originalCard?.characters ||
        formValues.pinyin !== this.originalCard?.pinyin;
    });
  }
}
