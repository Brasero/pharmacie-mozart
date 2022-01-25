/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

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
    private api: ApiService
  ) {}

  ngOnInit() {}

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
      const obj = await this.api.constructObject(
        this.beneficiaire,
        this.generique
      );
      if (obj !== false) {
        this.api.sendOrdonnance(obj).subscribe(
          (data) => {
            console.log(data);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        const response = "Impossible d'envoyer l'ordonnance";
        console.error(response);
      }
    }
  }
}
