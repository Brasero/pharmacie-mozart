/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Capacitor } from '@capacitor/core';
import { Cordova } from '@awesome-cordova-plugins/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  base64Img;
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  //Load the local saved photo

  public async loadSaved() {
    //retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePhoto() {
    // Remove the last photo
    this.photos.splice(0, 1);
  }

  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      direction: CameraDirection.Rear,
      quality: 100,
      allowEditing: true,
      promptLabelHeader: 'Importer une nouvelle ordonnance',
      promptLabelCancel: 'Annuler',
      promptLabelPhoto: 'Gallerie',
      promptLabelPicture: 'Prendre une photo',
      presentationStyle: 'popover',
      saveToGallery: false,
    });
    await this.deletePhoto();
    const savedImageFile = await this.savePicture(capturedPhoto);
    //
    console.log({ initial: capturedPhoto, modified: savedImageFile });
    //
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }
  private async savePicture(photo: Photo) {
    //Conversion de la photo en base 64
    const base64Data = await this.readAsBase64(photo);

    //Enregistrement du fichier dans le dossier
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      //The problems seems to be here
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        phpFilepath: fileName,
        phpWebviewPath: photo.webPath,
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        phpFilepath: savedFile.uri,
        phpWebviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    //"hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      //Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      //Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
  phpFilepath?: string;
  phpWebviewPath?: string;
}
