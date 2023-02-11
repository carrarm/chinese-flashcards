import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'src/app/core/model/card.model';
import { CardService } from 'src/app/core/services/card.service';
import { toOptional } from 'src/app/core/utils/form.utils';

interface CardForm {
  meaning: FormControl<string | null>;
  pinyin: FormControl<string | null>;
  chinese: FormControl<string | null>;
}

@Component({
  selector: 'chf-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss'],
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

  private collectionId: number;
  private cardId?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card?: Card; collection: number },
    public dialogRef: MatDialogRef<CardEditorComponent>,
    private cardService: CardService
  ) {
    if (data.card) {
      this.form.patchValue({
        meaning: data.card.meanings.join(' ; '),
        pinyin: data.card.pinyin,
        chinese: data.card.characters,
      });
      this.creationMode = false;
      this.cardId = data.card.id;
    }
    this.collectionId = data.collection;
  }

  writePinyinCharacter(character: string): void {
    this.form.patchValue({
      pinyin: (this.form.value.pinyin ?? '') + character,
    });
  }

  removePinyinCharacter(): void {
    const currentValue = this.form.value.pinyin;
    if (currentValue?.length) {
      this.form.patchValue({
        pinyin: currentValue.substring(0, currentValue.length - 1),
      });
    }
  }

  async saveCard(): Promise<void> {
    const { meaning, chinese, pinyin } = this.form.value;
    if (meaning && (chinese || pinyin)) {
      const card: Card = {
        meanings: meaning.split(';').map((meaning) => meaning.trim()),
        pinyin: toOptional(pinyin),
        characters: toOptional(chinese),
        collectionId: this.collectionId,
        id: this.cardId,
      };
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

  async deleteCard(): Promise<void> {
    if (this.cardId) {
      await this.cardService.deleteCard(this.cardId);
    }
    this.dialogRef.close();
  }
}
