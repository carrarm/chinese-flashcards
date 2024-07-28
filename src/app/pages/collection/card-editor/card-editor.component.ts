import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Card } from "@core/model/card.model";
import { CardService } from "@core/services/card.service";
import { SettingsService } from "@core/services/settings.service";
import { Nullable } from "@core/types";
import { toOptional } from "@core/utils/form.utils";

interface CardForm {
  meaning: FormControl<Nullable<string>>;
  pinyin: FormControl<Nullable<string>>;
  chinese: FormControl<Nullable<string>>;
}

@Component({
  selector: "chf-card-editor",
  templateUrl: "./card-editor.component.html",
  styleUrls: ["./card-editor.component.scss"],
})
export class CardEditorComponent implements OnInit {
  public keepEditorOpen = false;
  public virtualKeyboardOpen = false;
  public creationMode = true;
  public cardDuplicate?: Card;

  public form = new FormGroup<CardForm>({
    meaning: new FormControl<Nullable<string>>(null, Validators.required),
    pinyin: new FormControl<Nullable<string>>(null),
    chinese: new FormControl<Nullable<string>>(null),
  });
  public texts = {
    title: "New card",
    save: "Create",
  };

  private collectionId: number;
  private originalCard?: Card;
  private resetRequired = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card?: Card; collection: number },
    public dialogRef: MatDialogRef<CardEditorComponent>,
    private cardService: CardService,
    private settingsService: SettingsService
  ) {
    if (data.card) {
      this.form.patchValue({
        meaning: data.card.meanings.join(" ; "),
        pinyin: data.card.pinyin,
        chinese: data.card.characters,
      });
      this.creationMode = false;
      this.originalCard = data.card;
      this.texts = { title: "Edit card", save: "Update" };
    }
    this.collectionId = data.collection;
  }

  ngOnInit(): void {
    this.settingsService.getSettings().then((settings) => {
      if (this.creationMode) {
        this.trackDuplicates();
      } else if (settings.resetCardProgress) {
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

      if (this.resetRequired) {
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

  private trackChanges(): void {
    this.form.valueChanges.subscribe((formValues) => {
      this.resetRequired =
        formValues.chinese !== this.originalCard?.characters ||
        formValues.pinyin !== this.originalCard?.pinyin;
    });
  }

  private trackDuplicates(): void {
    this.form.valueChanges.subscribe(async (formValues) => {
      this.cardDuplicate = undefined;
      const { meaning } = formValues;
      if (meaning) {
        this.cardDuplicate = await this.cardService.findCard(this.collectionId, {
          meanings: meaning.split(";").map((m) => m.trim()),
        });
      }
    });
  }
}
