/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@awesome-cordova-plugins/launch-navigator/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(
    private launchNavigator: LaunchNavigator,
    private alertCtrl: AlertController
  ) {}
  public navigateWith(app: "waze" | "google") {
    let options: LaunchNavigatorOptions;
    let destination;
    let appName;
    if (app === 'waze') {
      destination = '5 Route de Metz, 57280 Maizières-lès-Metz';
      appName = 'Waze';
      options = {
        app: this.launchNavigator.APP.WAZE,
      };
    } else if (app === 'google') {
      destination = [49.2039843, 6.1607793];
      appName = 'Google Maps';
      options = {
        app: this.launchNavigator.APP.GOOGLE_MAPS,
      };
    }

    this.launchNavigator.navigate(destination, options).then(
      (success) => console.log('success: ', success),
      async () => await this.presentAlert(appName)
    );
  }

  private async presentAlert(appName: string) {
    const alert = await this.alertCtrl.create({
      header: "Impossible d'atteindre la cible",
      subHeader:
        "Oups, il semblerait que nous n'ayons pas reussi à trouver " +
        appName +
        ' dans votre appreil.',
      message:
        "Vérifiez que l'application est bien installée avant de réessayer.",
      buttons: ['OK'],
    });

    alert.present();
  }
}
