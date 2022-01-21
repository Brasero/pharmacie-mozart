/* eslint-disable @typescript-eslint/quotes */
import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { CallService } from '../services/call.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    public actionSheet: ActionSheetController,
    private router: Router,
    public photoService: PhotoService,
    private call: CallService
  ) {}

  naviguateTo(to: string) {
    this.router.navigate(['tabs/' + to]);
  }

  addOrdonnanceToGallery() {
    this.photoService
      .addNewToGallery()
      .then(() => this.naviguateTo('gallerie'));
  }

  public async confirmCall() {
    const confirmAction = await this.actionSheet.create({
      header: 'Composer le 03 87 80 21 06 ?',
      cssClass: 'confirmCallSheet',
      buttons: [
        {
          text: 'Appeler',
          icon: 'call-outline',
          id: 'validateCallButton',
          handler: () => {
            this.call.callOffice();
          },
        },
        {
          text: 'Annuler',
          role: 'cancel',
        },
      ],
    });

    await confirmAction.present();
  }
}
