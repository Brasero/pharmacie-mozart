/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import {
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-gallerie',
  templateUrl: './gallerie.page.html',
  styleUrls: ['./gallerie.page.scss'],
})
export class GalleriePage implements OnInit {
  beneficiaire: string;
  generique: boolean;

  constructor(
    public photoService: PhotoService,
    private router: Router,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  private async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Votre ordonnance a bien été envoyée',
      duration: 3000,
      color: 'success',
    });

    toast.onDidDismiss().then(() => {
      this.router.navigate(['/tabs']);
      this.photoService.deletePhoto();
    });
    return toast;
  }

  private async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'alert-custom',
      header: 'Erreur !',
      subHeader: "L'envoi de votre ordonnance à échoué",
      message,
      buttons: ['OK'],
    });

    return alert;
  }

  private async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Envoi en cours...',
      animated: true,
      spinner: 'bubbles',
    });
    return loading;
  }

  private addOrdonnanceToGallery() {
    this.photoService.addNewToGallery().then(() => {
      this.router.navigate(['/tabs/gallerie']);
    });
  }

  private async deleteAndRetake() {
    await this.addOrdonnanceToGallery();
  }

  private async checkOrdonnance() {
    if (this.beneficiaire !== undefined && this.generique !== undefined) {
      const loading = await this.presentLoading();
      loading.present();
      const obj = await this.api.constructObject(
        this.beneficiaire,
        this.generique
      );
      if (obj !== false) {
        this.api.sendOrdonnance(obj).subscribe(
          async (data) => {
            console.log(data);
            const success = await this.presentToast();
            loading.dismiss();
            success.present();
          },
          async (error) => {
            console.log(error);
            const alert = await this.presentAlert(error.statusText);
            alert.present();
            loading.dismiss();
          }
        );
      } else {
        const response = "Impossible d'envoyer l'ordonnance";
        console.error(response);
      }
    }
  }
}
