import { BooleanInput } from "@angular/cdk/coercion";
import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import { CoercionComponent } from "@core/coercion-component";
import { ButtonType } from "./button.types";

@Component({
  selector: "chf-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent extends CoercionComponent implements OnChanges {
  @Input() type: ButtonType = "default";
  @Input() callToAction?: BooleanInput;
  @Input() disabled?: BooleanInput;

  ngOnChanges(): void {
    this.coerceAll(["callToAction", "disabled"]);
  }
}
