import { CommonModule } from "@angular/common";
import { Component, effect, forwardRef, model } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ControlValueAccessorComponent } from "@core/control-value-accessor-component";

@Component({
  selector: "chf-slide-toggle",
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
  public readonly active = model<boolean>();

  constructor() {
    super();

    effect(() => {
      this.updateValue(!!this.active());
    });
  }

  public override updateValue(newValue: boolean): void {
    if (newValue !== this.value) {
      super.updateValue(newValue);
      this.active.set(newValue);
    }
  }
}
