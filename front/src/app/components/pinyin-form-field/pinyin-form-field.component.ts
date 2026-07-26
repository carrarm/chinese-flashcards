import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { hasTones, toTone } from "@core/utils/pinyin.utils";
import { findLastIndex, replaceCharAt } from "@core/utils/general.utils";

import { VirtualKeyboardComponent } from "../virtual-keyboard/virtual-keyboard.component";

type PropagateFct = (_?: string) => void;

@Component({
  selector: "chf-pinyin-form-field",
  imports: [
    FontAwesomeModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    VirtualKeyboardComponent,
  ],
  templateUrl: "./pinyin-form-field.component.html",
  styleUrls: ["./pinyin-form-field.component.scss"],
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

  private propagateChange: PropagateFct = () => {
    // Do nothing
  };

  protected writePinyinCharacter(character: string): void {
    this.updateValue((this.fieldValue ?? "") + character);
  }

  protected removePinyinCharacter(): void {
    const newValue = this.fieldValue?.length
      ? this.fieldValue.substring(0, this.fieldValue.length - 1)
      : undefined;
    this.updateValue(newValue);
  }

  public updateValue(newValue?: string): void {
    this.fieldValue = newValue
      ? this.simplifyText(newValue, newValue.at(-1) ?? "")
      : newValue;
    this.propagateChange(newValue);
  }

  public writeValue(newValue: string): void {
    this.fieldValue = newValue;
  }

  public registerOnChange(fn: PropagateFct): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // Do nothing
  }

  public setDisabledState(): void {
    // Do nothing
  }

  private applyTone(word: string, tone: number): string {
    let wordWithTone = word;
    const toTransformIdx = findLastIndex(word.toUpperCase().split(""), (letter: string) =>
      hasTones(letter)
    );
    if (toTransformIdx > -1) {
      const charWithTone = toTone(wordWithTone.charAt(toTransformIdx), tone);
      wordWithTone = replaceCharAt(wordWithTone, toTransformIdx, charWithTone).slice(
        0,
        -1
      );
    }
    return wordWithTone;
  }

  private simplifyText(text: string, lastTyped: string): string {
    const lastWord = text.split(" ").at(-1) ?? "";
    let simplified = lastWord;

    if (lastTyped.toUpperCase() === "V") {
      const replacedV = lastTyped === "V" ? "Ü" : "ü";
      simplified = simplified.replace(lastTyped, replacedV);
    }

    const digit = Number.parseInt(lastTyped);
    if (!Number.isNaN(digit) && lastWord.length > 1) {
      simplified = this.applyTone(lastWord, digit);
    }
    return text.replace(lastWord, simplified);
  }
}
