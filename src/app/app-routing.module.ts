import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionCardsComponent } from './pages/collection/collection-cards/collection-cards.component';
import { CollectionListComponent } from './pages/collection/collection-list/collection-list.component';

const routes: Routes = [
  {
    path: 'collections',
    component: CollectionListComponent,
  },
  {
    path: 'collections/:id',
    component: CollectionCardsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
