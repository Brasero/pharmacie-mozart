import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.page.html',
  styleUrls: ['./acceuil.page.scss'],
})
export class AcceuilPage implements OnInit {
  constructor(
    private router: Router,
    private camera: PhotoService,
    private nav: NavigationService
  ) {}
  ngOnInit() {}

  navigateTo(target) {
    this.router.navigate(['tabs/' + target]);
  }

  addOrdonnanceToGallery() {
    this.camera.addNewToGallery().then(() => this.navigateTo('gallerie'));
  }

  navigate(app) {
    this.nav.navigateWith(app);
  }
}
