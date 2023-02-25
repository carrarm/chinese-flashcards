import { Component, forwardRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VirtualKeyboardComponent } from '../virtual-keyboard/virtual-keyboard.component';
import { MatIconModule } from '@angular/material/icon';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

const modules = [
  FormsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  NgIf,
  VirtualKeyboardComponent,
];

@Component({
  selector: 'chf-pinyin-form-field',
  standalone: true,
  imports: modules,
  templateUrl: './pinyin-form-field.component.html',
  styleUrls: ['./pinyin-form-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PinyinFormFieldComponent),
      multi: true,
    },
  ],
})
export class PinyinFormFieldComponent implements ControlValueAccessor {
  public virtualKeyboardOpen = false;
  public fieldValue?: string;

  private propagateChange = (_?: string) => {};

  writePinyinCharacter(character: string): void {
    this.updateValue((this.fieldValue ?? '') + character);
  }

  removePinyinCharacter(): void {
    const newValue = this.fieldValue?.length
      ? this.fieldValue.substring(0, this.fieldValue.length - 1)
      : undefined;
    this.updateValue(newValue);
  }

  updateValue(newValue?: string): void {
    this.fieldValue = newValue;
    this.propagateChange(newValue);
  }

  writeValue(newValue: string): void {
    this.fieldValue = newValue;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(_: any): void {
    // Do nothing
  }

  setDisabledState?(_: boolean): void {
    // Do nothing
  }
}
