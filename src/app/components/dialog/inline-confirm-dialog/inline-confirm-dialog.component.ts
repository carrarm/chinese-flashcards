
import { Component, Input, output } from "@angular/core";
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
  @Input() confirmText?: string;
  @Input() cancelText?: string;
  @Input() confirmType: ButtonType = "primary";
  public readonly cancelled = output<void>();
  public readonly confirmed = output<void>();
}
