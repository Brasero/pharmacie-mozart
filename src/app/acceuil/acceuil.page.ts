import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.page.html',
  styleUrls: ['./acceuil.page.scss'],
})
export class AcceuilPage implements OnInit {
  constructor(
    private router: Router,
    private camera: PhotoService,
    private nav: NavigationService,
    private actionSheetCtrl: ActionSheetController
  ) {}
  ngOnInit() {}

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Se rendre à la pharmacie',
      subHeader: 'Choisissez votre application de navigation',
      buttons: [
        {
          text: 'Waze',
          icon: 'car-sport-outline',
          handler: () => {
            this.navigate('waze');
          },
        },
        {
          text: 'Google Maps',
          icon: 'logo-google',
          handler: () => {
            this.navigate('google');
          },
        },
        {
          text: 'Annuler',
          icon: 'close',
          role: 'cancel',
        }
      ]
    });
    await actionSheet.present();
  }
  navigateTo(target) {
    this.router.navigate(['tabs/' + target]);
  }

  addOrdonnanceToGallery() {
    this.camera.addNewToGallery().then(() => this.navigateTo('gallerie'));
  }

  navigate(app) {
    this.nav.navigateWith(app);
  }
}
