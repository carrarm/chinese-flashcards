import { Routes } from "@angular/router";
import { PendingChangesGuard } from "@core/guards/pending-changes.guard";
import { CollectionCardsComponent } from "./pages/collection/collection-cards/collection-cards.component";
import { CollectionListComponent } from "./pages/collection/collection-list/collection-list.component";
import { SessionLauncherComponent } from "./pages/learn/session-launcher/session-launcher.component";
import { SessionComponent } from "./pages/learn/session/session.component";
import { SettingsComponent } from "./pages/settings/settings.component";

export const routes: Routes = [
  {
    path: "sessions",
    component: SessionLauncherComponent,
  },
  {
    path: "sessions/active",
    component: SessionComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "collections",
    component: CollectionListComponent,
  },
  {
    path: "collections/:id",
    component: CollectionCardsComponent,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },
  { path: "", pathMatch: "full", redirectTo: "/sessions" },
];
