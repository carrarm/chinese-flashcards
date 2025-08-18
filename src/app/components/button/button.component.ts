import { CommonModule } from "@angular/common";
import { booleanAttribute, Component, computed, input } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition, IconName } from "@fortawesome/free-solid-svg-icons";
import { ButtonType } from "./button.types";

@Component({
  selector: "chf-button",
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent {
  public readonly type = input<ButtonType>("default");
  public readonly callToAction = input(false, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly iconButton = input(false, { transform: booleanAttribute });
  public readonly icon = input<IconDefinition | IconName>();
  public readonly text = input("");

  protected isIconButton = computed(
    () => this.iconButton() || !!(this.icon() && !this.text())
  );
}
