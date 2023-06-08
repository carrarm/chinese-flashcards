import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate } from "@angular/service-worker";

export const checkForUpdates = (
  swUpdate: SwUpdate,
  snackbar: MatSnackBar
): (() => Promise<void>) => {
  return (): Promise<void> =>
    new Promise((resolve) => {
      swUpdate.checkForUpdate();
      swUpdate.versionUpdates.subscribe(() => {
        snackbar
          .open("A new version is available", "Reload now", {
            verticalPosition: "top",
            duration: 5000,
          })
          .onAction()
          .subscribe(() => {
            window.location.reload();
          });
      });

      resolve();
    });
};
