import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './../../../../../../../assets/animations/routeAnimations';

@Component({
  selector: 'app-document-locker-home',
  templateUrl: './document-locker-home.component.html',
  styleUrls: ['./document-locker-home.component.scss'],
  animations: [routeAnimations]
})
export class DocumentLockerHomeComponent implements AfterViewInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
