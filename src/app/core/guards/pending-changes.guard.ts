import { CanDeactivateFn } from "@angular/router";
import { Observable } from "rxjs";

export interface PendingChangesComponent {
  canDeactivate: () => Observable<boolean>;
}

export const PendingChangesGuard: CanDeactivateFn<PendingChangesComponent> = (
  component: PendingChangesComponent
): Observable<boolean> => component.canDeactivate();
