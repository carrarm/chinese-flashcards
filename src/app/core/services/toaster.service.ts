import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

const DEFAULT_DURATION_SECONDS = 2;

@Injectable({ providedIn: "root" })
export class ToasterService {
  constructor(private snackbar: MatSnackBar) {}

  public info(message: string, durationInSeconds = DEFAULT_DURATION_SECONDS): void {
    this.openNotification(message, "chf-notification-info", durationInSeconds);
  }

  public error(message: string, durationInSeconds = DEFAULT_DURATION_SECONDS): void {
    this.openNotification(message, "chf-notification-error", durationInSeconds);
  }

  private openNotification(
    message: string,
    customClass: string,
    durationInSeconds: number
  ): void {
    this.snackbar.open(message, "Close", {
      panelClass: customClass,
      duration: durationInSeconds * 1000,
    });
  }
}
