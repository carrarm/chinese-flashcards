import { Component, input, output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ButtonComponent } from "../../button/button.component";
import { ButtonType } from "../../button/button.types";

@Component({
  selector: "chf-inline-confirm-dialog",
  imports: [ButtonComponent, FontAwesomeModule],
  templateUrl: "./inline-confirm-dialog.component.html",
  styleUrls: ["./inline-confirm-dialog.component.scss"],
})
export class InlineConfirmDialogComponent {
  public readonly confirmText = input("");
  public readonly cancelText = input("");
  public readonly confirmType = input<ButtonType>("primary");

  public readonly cancelled = output<void>();
  public readonly confirmed = output<void>();
}
