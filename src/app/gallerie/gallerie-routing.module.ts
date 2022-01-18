import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GalleriePage } from './gallerie.page';

const routes: Routes = [
  {
    path: '',
    component: GalleriePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GalleriePageRoutingModule {}
