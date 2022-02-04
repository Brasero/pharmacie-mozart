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
  selector: 'app-gallerise',
  templateUrl: './gallerie.page.html',
  styleUrls: ['./gallerie.page.scss'],
})
export class GalleriePage implements OnInit {
  beneficiaire: string;
  generique: boolean;
  nameError: string | boolean = false;
  genError: string | boolean = false;
  regexName: RegExp;
  regexName2: RegExp;

  constructor(
    public photoService: PhotoService,
    private router: Router,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.beneficiaire = undefined;
    this.generique = undefined;
    this.regexName = /[²&~`{}()\@!#$£¤%§\\/":<>\?|;\[\]\^,*.+¨€]+/g;
    this.regexName2 = /(?:[A-Za-z'\-]+[ ]+[A-Za-z'\-]+[ ]*[A-Za-z'\- ]*)+/;
  }

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

  private checkName() {
    if (this.regexName.test(this.beneficiaire)) {
      this.nameError = 'Charactères non autorisé';
      this.beneficiaire = this.beneficiaire.replace(this.regexName, '');
    } else {
      this.nameError = false;
    }
    if (!this.regexName2.test(this.beneficiaire)) {
      this.nameError =
        "Saisissez au moins un nom et un prénom séparé d'un espace";
    } else {
      this.nameError = false;
    }
  }

  private checkGen() {
    if (this.generique !== undefined) {
      this.genError = false;
    }
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

  private checkNotAllowCharacters() {
    this.beneficiaire = this.beneficiaire.replace(this.regexName, '');
    return this.beneficiaire;
  }

  private async deleteAndRetake() {
    await this.addOrdonnanceToGallery();
  }

  private async checkOrdonnance() {
    this.checkNotAllowCharacters();
    if (
      this.beneficiaire !== undefined &&
      this.generique !== undefined &&
      !this.regexName.test(this.beneficiaire) &&
      this.beneficiaire !== null &&
      this.beneficiaire !== ''
    ) {
      const loading = await this.presentLoading();
      loading.present();
      const obj = await this.api.constructObject(
        this.beneficiaire,
        this.generique
      );
      if (obj !== false) {
        this.api.sendOrdonnance(obj).subscribe(
          async (data) => {
            if (data.result === true) {
              const success = await this.presentToast();
              loading.dismiss();
              success.present();
              this.beneficiaire = undefined;
              this.generique = undefined;
            } else {
              const alert = await this.presentAlert(
                "Une erreur s'est produite réessayer plus tard."
              );
              loading.dismiss();
              alert.present();
            }
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
      }
    } else {
      if (
        this.beneficiaire === '' ||
        this.beneficiaire === undefined ||
        this.beneficiaire === null
      ) {
        this.nameError = 'Merci de saisir un bénéficiaire';
      } else if (this.regexName.test(this.beneficiaire)) {
        this.nameError =
          'Mauvais format, merci de saisir un nom puis un prénom';
      } else {
        this.nameError = false;
      }

      this.genError =
        this.generique === undefined ? 'Choisissez une option' : false;
    }
  }
}
