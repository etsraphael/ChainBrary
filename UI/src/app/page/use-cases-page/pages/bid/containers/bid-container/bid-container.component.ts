import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { routeAnimations } from './../../../../../../../assets/animations/routeAnimations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bid-container',
  templateUrl: './bid-container.component.html',
  styleUrls: ['./bid-container.component.scss'],
  animations: [routeAnimations]
})
export class BidContainerComponent implements AfterViewInit {
  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
