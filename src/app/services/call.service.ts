import { Injectable } from '@angular/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor(private call: CallNumber) {}

  public callOffice() {
    this.call
      .callNumber('0387802106', true)
      .then((res) => console.log('Call launch', res))
      .catch((err) => console.log('Call failed ', err));
  }
}
