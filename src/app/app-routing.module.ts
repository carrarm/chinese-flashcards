import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionCardsComponent } from './pages/collection/collection-cards/collection-cards.component';
import { CollectionListComponent } from './pages/collection/collection-list/collection-list.component';
import { SessionLauncherComponent } from './pages/learn/session-launcher/session-launcher.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  {
    path: 'sessions',
    component: SessionLauncherComponent,
  },
  {
    path: 'collections',
    component: CollectionListComponent,
  },
  {
    path: 'collections/:id',
    component: CollectionCardsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: '/sessions' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
