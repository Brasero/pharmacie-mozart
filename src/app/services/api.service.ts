/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PhotoService } from './photo.service';
import { ApiMessage } from '../class/api-message';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //API path
  base_path = 'https://apimozar.store/';
  //APIKey
  apiKey = ''; // <--- Enter Api Key;
  //Http options
  httpOptions = {
    headers: new HttpHeaders(),
  };

  constructor(private http: HttpClient, private photo: PhotoService) {}

  //Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      //Handle client-side or network error
      console.error('Une erreur est survenue: ', error.error.message);
    } else {
      //Handle backend error return message
      console.error(
        `Le serveur a retourné le code erreur suivant: ${error.status}, ` +
          `message d'erreur: ${error.error}`
      );
    }
    //Return error with user-UI presentation
    return throwError("Quelque chose s'est mal passé. Réessayer plus tard.");
  }

  //Construction of the object to send
  async constructObject(b, g) {
    if (b !== undefined && g !== undefined) {
      //Load the photo as base64
      await this.photo.loadSaved();
      const response = await fetch(this.photo.photos[0].webviewPath);
      const blob = await response.blob();
      //Create formData object
      const obj: FormData = new FormData();
      //Filling formData Object
      obj.append('beneficiaire', b);
      obj.append('commentaire', g);
      //Filling formData object with saved photos
      this.photo.photos.map((value) => {
        obj.append('image[]', value.webviewPath);
      });
      return obj;
    } else {
      return false;
    }
  }

  //Sending the object to server and looking for response
  sendOrdonnance(item: FormData): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(this.base_path, item, this.httpOptions);
  }
}
