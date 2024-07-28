import { BooleanInput } from "@angular/cdk/coercion";
import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from "@angular/core";
import { CoercionComponent } from "@core/coercion-component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition, IconName } from "@fortawesome/free-solid-svg-icons";
import { ButtonType } from "./button.types";

@Component({
  selector: "chf-button",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent extends CoercionComponent implements OnChanges {
  @Input() type: ButtonType = "default";
  @Input() callToAction?: BooleanInput;
  @Input() disabled?: BooleanInput;
  @Input() iconButton?: BooleanInput;
  @Input() icon?: IconDefinition | IconName;
  @Input() text?: string;

  ngOnChanges(): void {
    this.coerceAll(["callToAction", "disabled", "iconButton"]);
  }
}
