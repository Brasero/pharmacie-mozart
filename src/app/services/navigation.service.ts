import { Injectable } from '@angular/core';
import {
  LaunchNavigator,
  LaunchNavigatorOptions,
} from '@awesome-cordova-plugins/launch-navigator/ngx';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private launchNavigator: LaunchNavigator) {}

  public navigateWith(app) {
    let options: LaunchNavigatorOptions;
    if (app === 'waze') {
      options = {
        app: this.launchNavigator.APP.WAZE,
      };
    } else if (app === 'google') {
      options = {
        app: this.launchNavigator.APP.GOOGLE_MAPS,
      };
    }

    this.launchNavigator.navigate([49.2039843, 6.1607793] || '', options).then(
      (success) => console.log('success'),
      (error) => console.log('Error launching navigator', error)
    );
  }
}
