import { Component, inject, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ButtonComponent } from "@components/button/button.component";
import { PinyinFormFieldComponent } from "@components/pinyin-form-field/pinyin-form-field.component";
import { Card } from "@core/model/card.model";
import { JoinPipe } from "@core/pipes/join.pipe";
import { CardService } from "@core/services/card.service";
import { SettingsService } from "@core/services/settings.service";
import { Nullable } from "@core/types";
import { toOptional } from "@core/utils/form.utils";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

interface CardForm {
  meaning: FormControl<Nullable<string>>;
  pinyin: FormControl<Nullable<string>>;
  chinese: FormControl<Nullable<string>>;
}

@Component({
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    FormsModule,
    JoinPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    PinyinFormFieldComponent,
    ReactiveFormsModule,
  ],
  selector: "chf-card-editor",
  templateUrl: "./card-editor.component.html",
  styleUrls: ["./card-editor.component.scss"],
})
export class CardEditorComponent implements OnInit {
  private readonly data: { card?: Card; collection: number } = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CardEditorComponent>);
  private readonly cardService = inject(CardService);
  private readonly settingsService = inject(SettingsService);

  protected readonly form = new FormGroup<CardForm>({
    meaning: new FormControl<Nullable<string>>(null, Validators.required),
    pinyin: new FormControl<Nullable<string>>(null),
    chinese: new FormControl<Nullable<string>>(null),
  });

  protected texts = {
    title: "New card",
    save: "Create",
  };

  protected keepEditorOpen = false;
  protected virtualKeyboardOpen = false;
  protected creationMode = true;
  protected cardDuplicate?: Card;
  protected duplicateMessageVisible = false;

  private collectionId = 0;
  private originalCard?: Card;
  private resetRequired = false;

  public ngOnInit(): void {
    if (this.data.card) {
      this.form.patchValue({
        meaning: this.data.card.meanings.join(" ; "),
        pinyin: this.data.card.pinyin,
        chinese: this.data.card.characters,
      });
      this.creationMode = false;
      this.originalCard = this.data.card;
      this.texts = { title: "Edit card", save: "Update" };
    }
    this.collectionId = this.data.collection;

    this.settingsService.getSettings().then((settings) => {
      if (this.creationMode) {
        this.trackDuplicates();
      } else if (settings.resetCardProgress) {
        this.trackChanges();
      }
    });
  }

  protected async saveCard(): Promise<void> {
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
      this.duplicateMessageVisible = false;
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
