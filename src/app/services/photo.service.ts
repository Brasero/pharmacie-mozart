/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
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

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  //Load the local saved photo

  public async loadSaved() {
    //retrieve cached photo array data return base64 photo
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
    else{
      for (let photo of this.photos){
        const readFile = await Filesystem.readFile({
          path: photo.phpFilepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async deletePhoto() {
    // Remove all photos from current storage.
    this.photos.splice(0, this.photos.length);
    // Remove all photos from Local storage, by overwritting.
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(null),
    });
  }

  public async addNewToGallery() {
    //Opening camera view or loading local saved photo from gallery
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      direction: CameraDirection.Rear,
      quality: 100,
      allowEditing: false,
      promptLabelHeader: 'Importer mon ordonnance',
      promptLabelCancel: 'Annuler',
      promptLabelPhoto: 'Gallerie',
      promptLabelPicture: 'Prendre une photo',
      presentationStyle: 'popover',
      saveToGallery: false,
    });
    //await for cleaning storage
    await this.deletePhoto();
    //Saving image shot.
    const savedImageFile = await this.savePicture(capturedPhoto);
    console.log({saved : savedImageFile});
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  //Adding new image to the collection
  public async addMoreToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      direction: CameraDirection.Rear,
      quality: 100,
      allowEditing: false,
      promptLabelHeader: 'Ajouter une ordonnance',
      promptLabelCancel: 'Annuler',
      promptLabelPhoto: 'Gallerie',
      promptLabelPicture: 'Prendre une photo',
      presentationStyle: 'popover',
      saveToGallery: false,
    });
    const savedImageFile = await this.savePicture(capturedPhoto);
    const libLength = this.photos.unshift(savedImageFile);
    // Limite de 3 photos par envoie
    if (libLength > 3) {
      this.photos.splice(3, 1);
    }
    // ---- END -----

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  private async savePicture(photo: Photo) {
    //Conversion de la photo en base 64
    const base64Data = await this.readAsBase64(photo);

    //Enregistrement du fichier dans le dossier local de l'appareil
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: photo.webPath, //The modification is here
        phpFilepath: fileName,
        phpWebviewPath: Capacitor.convertFileSrc(savedFile.uri),
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
