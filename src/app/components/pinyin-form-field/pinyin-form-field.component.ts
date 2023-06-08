import { NgIf } from "@angular/common";
import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { VirtualKeyboardComponent } from "../virtual-keyboard/virtual-keyboard.component";

const modules = [
  FontAwesomeModule,
  FormsModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  NgIf,
  VirtualKeyboardComponent,
];

type PropagateFct = (_?: string) => void;

@Component({
  selector: "chf-pinyin-form-field",
  standalone: true,
  imports: modules,
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
  public keyboardIcon = faKeyboard;

  private propagateChange: PropagateFct = () => {
    // Do nothing
  };

  writePinyinCharacter(character: string): void {
    this.updateValue((this.fieldValue ?? "") + character);
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

  registerOnChange(fn: PropagateFct): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {
    // Do nothing
  }

  setDisabledState(): void {
    // Do nothing
  }
}
