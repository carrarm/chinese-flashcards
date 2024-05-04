import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ControlValueAccessorComponent } from "@core/control-value-accessor-component";

@Component({
  selector: "chf-slide-toggle",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./slide-toggle.component.html",
  styleUrls: ["./slide-toggle.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SlideToggleComponent),
      multi: true,
    },
  ],
})
export class SlideToggleComponent extends ControlValueAccessorComponent<boolean> {
  @Input()
  set active(isActive: boolean) {
    this.updateValue(isActive);
  }

  @Output() activeChange = new EventEmitter<boolean>();

  public override updateValue(newValue: boolean): void {
    if (newValue !== this.value) {
      super.updateValue(newValue);
      this.activeChange.emit(newValue);
    }
  }
}
