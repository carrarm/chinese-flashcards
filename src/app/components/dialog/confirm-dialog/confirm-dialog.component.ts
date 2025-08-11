import { Component, Inject } from "@angular/core";
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public config: ConfirmDialogConfig,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}
}
