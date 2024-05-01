import { ControlValueAccessor } from "@angular/forms";

type Callback<T> = (value: T) => void;

/**
 * Components that need Reactive Form compatibility can extend `ControlValueAccessorComponent`
 * to pre-configure `ControlValueAccessor` methods.
 */
export class ControlValueAccessorComponent<T> implements ControlValueAccessor {
  /** Model value, synchronized with Reactive Forms */
  public value!: T;

  private propagateChange: Callback<T> = () => {
    // Do nothing
  };

  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(fn: Callback<T>): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {
    // Do nothing
  }

  public setDisabledState?(): void {
    // Do nothing
  }

  public updateValue(newValue: T) {
    this.value = newValue;
    this.propagateChange(this.value);
  }
}
