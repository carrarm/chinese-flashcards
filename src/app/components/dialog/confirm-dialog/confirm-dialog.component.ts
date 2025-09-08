import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ButtonType } from "../../button/button.types";
import { InlineConfirmDialogComponent } from "../inline-confirm-dialog/inline-confirm-dialog.component";

export interface ConfirmDialogConfig {
  confirmText?: string;
  cancelText?: string;
  confirmType: ButtonType;
  title: string;
  message: string;
}

@Component({
  selector: "chf-confirm-dialog",
  imports: [InlineConfirmDialogComponent, MatDialogModule],
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent {
  protected readonly config: ConfirmDialogConfig = inject(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
}
