import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { ButtonComponent } from "../../button/button.component";
import { ButtonType } from "../../button/button.types";

@Component({
  selector: "chf-inline-confirm-dialog",
  standalone: true,
  imports: [CommonModule, ButtonComponent, FontAwesomeModule],
  templateUrl: "./inline-confirm-dialog.component.html",
  styleUrls: ["./inline-confirm-dialog.component.scss"],
})
export class InlineConfirmDialogComponent {
  @Input() confirmText?: string;
  @Input() cancelText?: string;
  @Input() confirmType: ButtonType = "primary";
  @Output() cancelled = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  public icons = {
    close: faClose,
  };
}
