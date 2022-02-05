import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'gallerie',
        loadChildren: () =>
          import('../gallerie/gallerie.module').then(
            (m) => m.GalleriePageModule
          ),
      },
      {
        path: 'acceuil',
        loadChildren: () =>
          import('../acceuil/acceuil.module').then((m) => m.AcceuilPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/acceuil',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/acceuil',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
