import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimations } from './../../../assets/animations/routeAnimations';
import useCaseRoutes from './../../shared/data/useCaseRoutes';
import { ServiceItemMenu } from './../../shared/interfaces';

@Component({
  selector: 'app-use-cases-page',
  templateUrl: './use-cases-page.component.html',
  styleUrls: ['./use-cases-page.component.scss'],
  animations: [routeAnimations]
})
export class UseCasesPageComponent implements AfterViewInit {
  useCaseRoutes: ServiceItemMenu[] = useCaseRoutes;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
