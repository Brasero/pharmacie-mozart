/* eslint-disable @typescript-eslint/quotes */
import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    public actionSheet: ActionSheetController,
    private router: Router,
    public photoService: PhotoService
  ) {}

  naviguateTo(to: string) {
    this.router.navigate(['tabs/' + to]);
  }

  addOrdonnanceToGallery() {
    this.photoService
      .addNewToGallery()
      .then(() => this.naviguateTo('gallerie'));
  }
}
