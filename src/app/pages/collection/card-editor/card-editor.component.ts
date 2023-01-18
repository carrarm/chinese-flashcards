import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'src/app/core/model/card.model';

@Component({
  selector: 'chf-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss'],
})
export class CardEditorComponent {
  public meanings: string[];
  public pinyin?: string;
  public characters?: string;
  public keepEditorOpen = false;
  public saveBtnText = 'Save and close';

  constructor(@Inject(MAT_DIALOG_DATA) card?: Card) {
    this.meanings = card?.meanings ?? [];
    this.pinyin = card?.pinyin;
    this.characters = card?.characters;
  }
}
