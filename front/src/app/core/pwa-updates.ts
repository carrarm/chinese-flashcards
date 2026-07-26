import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate } from "@angular/service-worker";

/**
 * Forces the service worker to check for updates and notify the user
 * that a new version can be installed.
 *
 * @param swUpdate Service worker update service
 * @param snackbar SnackBar service to notify the user
 */
export const checkForUpdates = (
  swUpdate: SwUpdate,
  snackbar: MatSnackBar
): (() => Promise<void>) => {
  return (): Promise<void> =>
    new Promise((resolve) => {
      swUpdate.checkForUpdate();
      swUpdate.versionUpdates.subscribe((event) => {
        if (event.type === "VERSION_READY") {
          snackbar
            .open("A new version is available", "Reload now", {
              verticalPosition: "top",
              duration: 5000,
            })
            .onAction()
            .subscribe(() => {
              window.location.reload();
            });
        }
      });

      resolve();
    });
};
