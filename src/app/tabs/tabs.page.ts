/* eslint-disable @typescript-eslint/quotes */
import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(
    public actionSheet: ActionSheetController,
    private router: Router
  ) {}

  naviguateTo(to: string) {
    this.router.navigate(['tabs/' + to]);
  }

  async openNewOrdonnanceOptions() {
    const openAction = await this.actionSheet.create({
      header: 'Nouvelle ordonnance',
      cssClass: '',
      buttons: [
        {
          text: 'Prendre une photo',
          role: 'take picture',
          icon: 'camera-outline',
          data: 'photo',
          handler: () => {},
        },
        {
          text: 'Choisir une photo dans la gallerie',
          role: 'load picture',
          icon: 'images-outline',
          data: 'gallery',
          handler: () => {
            this.naviguateTo('gallerie');
          },
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel',
          cssClass: 'danger',
        },
      ],
    });

    await openAction.present();

    const { role, data } = await openAction.onDidDismiss();
    console.log('onDismiss resolved with role and data', role, data);
  }
}
