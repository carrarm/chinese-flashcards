import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { MatCardModule } from '@angular/material/card';
import { CollectionCardsComponent } from './collection-cards/collection-cards.component';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { CardMeaningsPipe } from 'src/app/core/pipes/card-meanings.pipe';
import { CardEditorComponent } from './card-editor/card-editor.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VirtualKeyboardComponent } from 'src/app/components/virtual-keyboard/virtual-keyboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CollectionEditorComponent } from './collection-editor/collection-editor.component';
import { PinyinFormFieldComponent } from 'src/app/components/pinyin-form-field/pinyin-form-field.component';

@NgModule({
  declarations: [
    CollectionListComponent,
    CollectionCardsComponent,
    CardEditorComponent,
    CollectionEditorComponent,
  ],
  imports: [
    CardMeaningsPipe,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    PinyinFormFieldComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CollectionPageModule {}
