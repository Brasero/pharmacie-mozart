import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GalleriePageRoutingModule } from './gallerie-routing.module';

import { GalleriePage } from './gallerie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GalleriePageRoutingModule
  ],
  declarations: [GalleriePage]
})
export class GalleriePageModule {}
