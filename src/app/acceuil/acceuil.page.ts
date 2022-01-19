import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.page.html',
  styleUrls: ['./acceuil.page.scss'],
})
export class AcceuilPage implements OnInit {
  constructor(private router: Router, private camera: PhotoService) {}

  ngOnInit() {}

  navigateTo(target) {
    this.router.navigate(['tabs/' + target]);
  }

  addOrdonnanceToGallery() {
    this.camera.addNewToGallery().then(() => this.navigateTo('gallerie'));
  }
}
