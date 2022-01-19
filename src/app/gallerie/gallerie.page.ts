import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallerie',
  templateUrl: './gallerie.page.html',
  styleUrls: ['./gallerie.page.scss'],
})
export class GalleriePage implements OnInit {
  constructor(public photoService: PhotoService, private router: Router) {}

  ngOnInit() {
    let beneficiaire: string;
    let commentaire: string;
  }

  private addOrdonnanceToGallery() {
    this.photoService.addNewToGallery().then(() => {
      this.router.navigate(['/tabs/gallerie']);
    });
  }

  private async deleteAndRetake() {
    await this.photoService.deletePhoto().then(() => {
      this.addOrdonnanceToGallery();
    });
  }
}
